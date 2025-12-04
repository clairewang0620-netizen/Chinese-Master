import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Home, MessageCircle, RotateCcw, Settings, Volume2, 
  CheckCircle, XCircle, Lock, ChevronRight, BrainCircuit, Bookmark, 
  Loader2, AlertTriangle
} from 'lucide-react';
import { MOCK_LESSONS, LEVELS } from './constants';
import { Lesson, Mistake, ContentType, Word, Dialogue, QuizQuestion, DialogueLine } from './types';
import { generateSpeech, explainConcept, prefetchAudio, resumeAudioContext } from './services/geminiService';

// --- Components ---

const BottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'mistakes', icon: Bookmark, label: 'Mistakes' },
    { id: 'profile', icon: Settings, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab.id ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const WordCard = ({ word, onNext }: { word: Word, onNext?: () => void }) => {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePlay = async () => {
    if (isLoadingAudio) return;
    setErrorMsg(null);
    await resumeAudioContext();

    setIsLoadingAudio(true);
    try {
      await generateSpeech(word.hanzi);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Audio failed.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleExplain = async () => {
    if (explanation) return;
    setLoadingExpl(true);
    const expl = await explainConcept(word.hanzi);
    setExplanation(expl);
    setLoadingExpl(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-sm w-full mx-auto relative border border-slate-100">
      <div className="bg-rose-50 h-32 flex items-center justify-center relative">
         <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm p-1 rounded-full cursor-help hover:bg-white transition-colors" onClick={handleExplain} title="AI Explain">
            <BrainCircuit className="text-rose-400 w-5 h-5" />
         </div>
         <span className="text-6xl font-chinese font-bold text-rose-600">{word.hanzi}</span>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{word.pinyin}</h3>
        <p className="text-slate-500 mb-6 font-medium text-lg">{word.meaning}</p>
        
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">Example</p>
            <p className="font-chinese text-lg text-slate-700">{word.exampleSentence}</p>
            <p className="text-slate-500 text-sm">{word.exampleMeaning}</p>
        </div>

        {loadingExpl && (
           <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left border border-amber-100 flex items-center gap-2">
              <Loader2 className="animate-spin text-amber-500" size={16} />
              <p className="text-amber-800 text-sm">Teacher is thinking...</p>
           </div>
        )}

        {explanation && !loadingExpl && (
           <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left border border-amber-100 animate-fade-in">
              <p className="text-amber-600 text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                <BrainCircuit size={12}/> AI Explanation
              </p>
              <p className="text-slate-700 text-sm">{explanation}</p>
          </div>
        )}
        
        {errorMsg && (
          <p className="text-rose-500 text-xs mb-4 font-bold">{errorMsg}</p>
        )}

        <div className="flex gap-3 justify-center">
            <button 
                onClick={handlePlay}
                disabled={isLoadingAudio}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isLoadingAudio 
                    ? 'bg-rose-100 text-rose-500' 
                    : 'bg-slate-100 text-rose-600 hover:bg-slate-200'
                }`}
            >
                {isLoadingAudio ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Volume2 size={24} />
                )}
            </button>
            {onNext && (
                <button 
                    onClick={onNext}
                    className="flex-1 h-14 bg-rose-600 text-white rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    Next <ChevronRight size={20}/>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

const DialogueView = ({ dialogue }: { dialogue: Dialogue }) => {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    const playLine = async (line: DialogueLine, index: number) => {
        if (playingIndex !== null) return; 
        await resumeAudioContext();
        setPlayingIndex(index);
        try {
           await generateSpeech(line.hanzi);
        } catch (e) {
           console.error(e);
        }
        setPlayingIndex(null);
    };

    return (
        <div className="max-w-md mx-auto space-y-4 pb-24">
            <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">{dialogue.title}</h2>
            {dialogue.lines.map((line, idx) => {
                const isUser = line.speaker === 'B';
                const isPlaying = playingIndex === idx;
                
                return (
                    <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                        <img src={line.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-200 object-cover shrink-0" />
                        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                             <div 
                                onClick={() => playLine(line, idx)}
                                className={`p-3 rounded-2xl cursor-pointer transition-all ${
                                 isUser 
                                    ? 'bg-rose-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                                } ${isPlaying ? 'ring-4 ring-rose-200 scale-[1.02]' : 'hover:opacity-90'}`}
                             >
                                <div className="flex items-center gap-2">
                                  <p className="font-chinese text-lg font-medium">{line.hanzi}</p>
                                  {isPlaying && <Loader2 size={16} className="animate-spin" />}
                                </div>
                             </div>
                             <div className={`mt-1 text-xs text-slate-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                                <span className="block font-medium">{line.pinyin}</span>
                                <span className="block opacity-75">{line.meaning}</span>
                             </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const QuizView = ({ questions, onFinish, onMistake }: { 
    questions: QuizQuestion[], 
    onFinish: () => void,
    onMistake: (m: Mistake) => void 
}) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    
    const question = questions[currentIdx];
    const isCorrect = selectedOpt === question.correctAnswer;

    const handleSelect = (idx: number) => {
        if (hasAnswered) return;
        setSelectedOpt(idx);
        setHasAnswered(true);

        if (idx !== question.correctAnswer) {
            onMistake({
                id: crypto.randomUUID(),
                question: question.question,
                userAnswer: question.options[idx],
                correctAnswer: question.options[question.correctAnswer],
                explanation: question.explanation,
                timestamp: Date.now()
            });
        }
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOpt(null);
            setHasAnswered(false);
        } else {
            onFinish();
        }
    };

    return (
        <div className="max-w-md mx-auto h-full flex flex-col">
            <div className="mb-6">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-rose-500 h-full transition-all duration-300" 
                        style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <p className="text-right text-xs text-slate-400 mt-2">Question {currentIdx + 1}/{questions.length}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <h3 className="text-lg font-bold text-slate-800">{question.question}</h3>
            </div>

            <div className="space-y-3 flex-1">
                {question.options.map((opt, idx) => {
                    let btnClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all ";
                    
                    if (hasAnswered) {
                        if (idx === question.correctAnswer) {
                            btnClass += "border-green-500 bg-green-50 text-green-700";
                        } else if (idx === selectedOpt) {
                            btnClass += "border-rose-500 bg-rose-50 text-rose-700";
                        } else {
                            btnClass += "border-slate-100 text-slate-400 opacity-50";
                        }
                    } else {
                        btnClass += "border-slate-100 hover:border-rose-200 hover:bg-rose-50 text-slate-700";
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={hasAnswered}
                            className={btnClass}
                        >
                            <div className="flex justify-between items-center">
                                {opt}
                                {hasAnswered && idx === question.correctAnswer && <CheckCircle className="text-green-500" size={20} />}
                                {hasAnswered && idx === selectedOpt && idx !== question.correctAnswer && <XCircle className="text-rose-500" size={20} />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {hasAnswered && (
                <div className="mt-6 animate-fade-in-up">
                    <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
                        <p className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                        <p className="text-sm">{question.explanation}</p>
                    </div>
                    <button 
                        onClick={handleNext}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Continue'}
                    </button>
                </div>
            )}
        </div>
    );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check if key is available in environment
    if (!process.env.API_KEY) {
        setApiKeyMissing(true);
    }
    const saved = localStorage.getItem('panda_mistakes');
    if (saved) {
        setMistakes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!activeLesson) return;

    // AGGRESSIVE PREFETCH: Fetch the first 5 immediately
    if (activeLesson.type === ContentType.VOCABULARY) {
        (activeLesson.content as Word[]).slice(0, 5).forEach(word => {
            prefetchAudio(word.hanzi);
        });
    } else if (activeLesson.type === ContentType.DIALOGUE) {
        (activeLesson.content as Dialogue).lines.forEach(line => {
            prefetchAudio(line.hanzi);
        });
    }
  }, [activeLesson]);

  const saveMistake = (m: Mistake) => {
    const newMistakes = [m, ...mistakes];
    setMistakes(newMistakes);
    localStorage.setItem('panda_mistakes', JSON.stringify(newMistakes));
  };

  const clearMistakes = () => {
      setMistakes([]);
      localStorage.removeItem('panda_mistakes');
  }

  const renderHome = () => (
    <div className="pb-24 px-6 pt-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Hello, Student! 👋</h1>
                <p className="text-slate-500">Ready to learn Chinese today?</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold border border-rose-200">
                🐼
            </div>
        </header>
        
        {apiKeyMissing && (
           <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 text-red-800 shadow-sm animate-pulse">
             <AlertTriangle className="shrink-0" />
             <div className="text-sm">
               <p className="font-bold">Missing API Key</p>
               <p>Please go to Vercel Settings → Environment Variables and add <code>API_KEY</code>.</p>
             </div>
           </div>
        )}

        <div className="space-y-8">
            {LEVELS.map(level => {
                const levelLessons = MOCK_LESSONS.filter(l => l.level === level);
                if (levelLessons.length === 0) return null;
                
                return (
                    <div key={level}>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-rose-500 rounded-full"></span>
                            {level}
                        </h2>
                        <div className="grid gap-4">
                            {levelLessons.map(lesson => (
                                <div 
                                    key={lesson.id}
                                    onClick={() => !lesson.isLocked && setActiveLesson(lesson)}
                                    className={`relative group bg-white p-5 rounded-2xl border transition-all ${
                                        lesson.isLocked 
                                            ? 'border-slate-100 opacity-70' 
                                            : 'border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 cursor-pointer'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`p-2 rounded-lg ${
                                            lesson.type === ContentType.VOCABULARY ? 'bg-blue-50 text-blue-500' :
                                            lesson.type === ContentType.DIALOGUE ? 'bg-purple-50 text-purple-500' :
                                            'bg-orange-50 text-orange-500'
                                        }`}>
                                            {lesson.type === ContentType.VOCABULARY && <BookOpen size={20} />}
                                            {lesson.type === ContentType.DIALOGUE && <MessageCircle size={20} />}
                                            {lesson.type === ContentType.QUIZ && <RotateCcw size={20} />}
                                        </div>
                                        {lesson.isLocked && <Lock className="text-slate-300" size={20} />}
                                    </div>
                                    <h3 className="font-bold text-slate-800">{lesson.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderMistakes = () => (
      <div className="pb-24 px-6 pt-8">
          <header className="mb-8 flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">Mistake Notebook</h1>
                <p className="text-slate-500">Review {mistakes.length} collected errors.</p>
             </div>
             {mistakes.length > 0 && (
                 <button onClick={clearMistakes} className="text-sm text-rose-500 font-medium hover:underline">
                     Clear All
                 </button>
             )}
          </header>

          {mistakes.length === 0 ? (
              <div className="text-center py-20">
                  <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <CheckCircle size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-600">No mistakes yet!</h3>
                  <p className="text-slate-400">Great job. Keep practicing.</p>
              </div>
          ) : (
              <div className="space-y-4">
                  {mistakes.map(m => (
                      <div key={m.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-rose-400">
                          <p className="font-bold text-slate-800 mb-2">{m.question}</p>
                          <div className="text-sm space-y-1">
                              <p className="text-rose-600 flex items-center gap-2"><XCircle size={14}/> Your answer: {m.userAnswer}</p>
                              <p className="text-green-600 flex items-center gap-2"><CheckCircle size={14}/> Correct: {m.correctAnswer}</p>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                              Tip: {m.explanation}
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );

  const renderProfile = () => (
      <div className="pb-24 px-6 pt-8">
           <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile & Settings</h1>
           
           <div className="bg-gradient-to-r from-rose-500 to-orange-400 rounded-3xl p-6 text-white shadow-lg shadow-rose-200 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm border border-white/30">
                        🐼
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Panda Learner</h2>
                        <p className="text-white/80 text-sm">Free Plan</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs text-white/70 uppercase font-bold tracking-wider">Day Streak</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{mistakes.length}</p>
                        <p className="text-xs text-white/70 uppercase font-bold tracking-wider">Mistakes</p>
                    </div>
                </div>
           </div>

           <div className="space-y-4">
                <button className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-slate-100 hover:bg-slate-50">
                    <span className="font-medium text-slate-700">Upgrade to Pro</span>
                    <Lock size={16} className="text-rose-500" />
                </button>
           </div>
           
           <p className="text-center text-xs text-slate-300 mt-12">v1.0.0 • Built with ❤️ & AI</p>
      </div>
  )

  const renderLessonContent = () => {
    if (!activeLesson) return null;

    return (
        <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col">
            <div className="bg-white px-6 py-4 flex items-center border-b border-slate-100">
                <button onClick={() => setActiveLesson(null)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
                    <XCircle size={24} />
                </button>
                <div className="ml-4">
                    <h2 className="font-bold text-slate-900">{activeLesson.title}</h2>
                    <p className="text-xs text-slate-500">{activeLesson.type}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeLesson.type === ContentType.VOCABULARY && (
                   <div className="h-full flex flex-col items-center justify-center space-y-6">
                      {(activeLesson.content as Word[]).map((word, i) => (
                          <div key={word.id} className="w-full">
                              <WordCard word={word} />
                              {i < (activeLesson.content as Word[]).length - 1 && (
                                  <div className="h-8 flex justify-center items-center">
                                      <div className="w-1 h-full bg-slate-200"></div>
                                  </div>
                              )}
                          </div>
                      ))}
                      <div className="w-full pt-8 pb-12">
                         <button 
                            onClick={() => setActiveLesson(null)}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg"
                         >
                            Complete Lesson
                         </button>
                      </div>
                   </div>
                )}

                {activeLesson.type === ContentType.DIALOGUE && (
                    <DialogueView dialogue={activeLesson.content as Dialogue} />
                )}

                {activeLesson.type === ContentType.QUIZ && (
                    <QuizView 
                        questions={activeLesson.content as QuizQuestion[]} 
                        onMistake={saveMistake}
                        onFinish={() => setActiveLesson(null)}
                    />
                )}
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {activeLesson ? renderLessonContent() : (
        <>
           {activeTab === 'home' && renderHome()}
           {activeTab === 'mistakes' && renderMistakes()}
           {activeTab === 'profile' && renderProfile()}
           <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
};

export default App;