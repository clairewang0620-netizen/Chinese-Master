import { ContentType, Lesson, Word } from './types';

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

// Helper to generate IDs
const uid = () => Math.random().toString(36).substr(2, 9);

// Data structure to hold raw content efficiently
interface RawWord {
  h: string; // Hanzi
  p: string; // Pinyin
  m: string; // Meaning
  es: string; // Example Sentence
  em: string; // Example Meaning
}

const VOCAB_DATABASE: Record<string, RawWord[]> = {
  "Greetings & Essentials": [
    { h: "你好", p: "Nǐ hǎo", m: "Hello", es: "你好，很高兴见到你。", em: "Hello, nice to meet you." },
    { h: "谢谢", p: "Xièxie", m: "Thank you", es: "谢谢你的帮助。", em: "Thank you for your help." },
    { h: "再见", p: "Zàijiàn", m: "Goodbye", es: "我们明天再见。", em: "See you tomorrow." },
    { h: "对不起", p: "Duìbuqǐ", m: "Sorry", es: "对不起，我迟到了。", em: "Sorry, I am late." },
    { h: "没关系", p: "Méiguānxi", m: "It doesn't matter", es: "没关系，别担心。", em: "It's okay, don't worry." },
    { h: "是", p: "Shì", m: "To be (is/am/are)", es: "我是学生。", em: "I am a student." },
    { h: "不是", p: "Bú shì", m: "Is not", es: "他不是老师。", em: "He is not a teacher." },
    { h: "好", p: "Hǎo", m: "Good", es: "这个主意很好。", em: "This is a good idea." },
    { h: "不好", p: "Bù hǎo", m: "Not good", es: "天气不好。", em: "The weather is not good." },
    { h: "请", p: "Qǐng", m: "Please", es: "请坐。", em: "Please sit down." },
    { h: "早安", p: "Zǎo'ān", m: "Good morning", es: "大家早安！", em: "Good morning everyone!" },
    { h: "晚安", p: "Wǎn'ān", m: "Good night", es: "我要睡觉了，晚安。", em: "I'm going to sleep, good night." },
    { h: "名字", p: "Míngzi", m: "Name", es: "你叫什么名字？", em: "What is your name?" },
    { h: "高兴", p: "Gāoxìng", m: "Happy", es: "认识你很高兴。", em: "Nice to meet you." },
    { h: "不客气", p: "Bú kèqi", m: "You're welcome", es: "不客气，这是我应该做的。", em: "You're welcome, it's my duty." },
    { h: "帮忙", p: "Bāngmáng", m: "To help", es: "你能帮忙吗？", em: "Can you help?" },
    { h: "借", p: "Jiè", m: "Borrow/Lend", es: "我想借一支笔。", em: "I want to borrow a pen." },
    { h: "给", p: "Gěi", m: "Give", es: "请给我那个。", em: "Please give me that." },
    { h: "知道", p: "Zhīdào", m: "Know", es: "我不知道。", em: "I don't know." },
    { h: "明白", p: "Míngbái", m: "Understand", es: "我明白了。", em: "I understand." },
  ],
  "Numbers & Time": [
    { h: "一", p: "Yī", m: "One", es: "我要一个苹果。", em: "I want one apple." },
    { h: "二", p: "Èr", m: "Two", es: "我有二个姐姐。", em: "I have two older sisters." },
    { h: "三", p: "Sān", m: "Three", es: "现在是三点。", em: "It is three o'clock." },
    { h: "四", p: "Sì", m: "Four", es: "我有四本书。", em: "I have four books." },
    { h: "五", p: "Wǔ", m: "Five", es: "五个人。", em: "Five people." },
    { h: "六", p: "Liù", m: "Six", es: "今天是六号。", em: "Today is the 6th." },
    { h: "七", p: "Qī", m: "Seven", es: "七天是一个星期。", em: "Seven days make a week." },
    { h: "八", p: "Bā", m: "Eight", es: "八点钟见。", em: "See you at 8 o'clock." },
    { h: "九", p: "Jiǔ", m: "Nine", es: "九个杯子。", em: "Nine cups." },
    { h: "十", p: "Shí", m: "Ten", es: "他十岁了。", em: "He is ten years old." },
    { h: "零", p: "Líng", m: "Zero", es: "二零二四年。", em: "Year 2024." },
    { h: "百", p: "Bǎi", m: "Hundred", es: "这本书一百块。", em: "This book is 100 yuan." },
    { h: "千", p: "Qiān", m: "Thousand", es: "这个手机一千块。", em: "This phone is 1000 yuan." },
    { h: "现在", p: "Xiànzài", m: "Now", es: "现在几点了？", em: "What time is it now?" },
    { h: "今天", p: "Jīntiān", m: "Today", es: "今天天气很好。", em: "The weather is good today." },
    { h: "明天", p: "Míngtiān", m: "Tomorrow", es: "明天见。", em: "See you tomorrow." },
    { h: "昨天", p: "Zuótiān", m: "Yesterday", es: "昨天我去了公园。", em: "Yesterday I went to the park." },
    { h: "早上", p: "Zǎoshang", m: "Morning", es: "早上好！", em: "Good morning!" },
    { h: "晚上", p: "Wǎnshang", m: "Evening", es: "晚上我要看电影。", em: "I will watch a movie in the evening." },
    { h: "下午", p: "Xiàwǔ", m: "Afternoon", es: "下午我有课。", em: "I have class in the afternoon." },
    { h: "点", p: "Diǎn", m: "O'clock", es: "我们在五点见面。", em: "We meet at 5 o'clock." },
    { h: "分钟", p: "Fēnzhōng", m: "Minute", es: "等我五分钟。", em: "Wait for me for 5 minutes." },
    { h: "星期", p: "Xīngqī", m: "Week", es: "今天是星期一。", em: "Today is Monday." },
    { h: "周末", p: "Zhōumò", m: "Weekend", es: "周末你做什么？", em: "What do you do on the weekend?" },
    { h: "月", p: "Yuè", m: "Month", es: "我的生日在八月。", em: "My birthday is in August." },
    { h: "年", p: "Nián", m: "Year", es: "新年快乐！", em: "Happy New Year!" },
  ],
  "Body & Health": [
    { h: "头", p: "Tóu", m: "Head", es: "我的头很疼。", em: "My head hurts." },
    { h: "手", p: "Shǒu", m: "Hand", es: "请洗手。", em: "Please wash your hands." },
    { h: "脚", p: "Jiǎo", m: "Foot/Leg", es: "我的脚受伤了。", em: "My foot is injured." },
    { h: "眼睛", p: "Yǎnjing", m: "Eye", es: "她的眼睛很大。", em: "Her eyes are big." },
    { h: "嘴巴", p: "Zuǐba", m: "Mouth", es: "张开嘴巴。", em: "Open your mouth." },
    { h: "耳朵", p: "Ěrduo", m: "Ear", es: "我有两个耳朵。", em: "I have two ears." },
    { h: "头发", p: "Tóufa", m: "Hair", es: "你的头发很长。", em: "Your hair is long." },
    { h: "肚子", p: "Dùzi", m: "Stomach", es: "我肚子饿了。", em: "I am hungry." },
    { h: "生病", p: "Shēngbìng", m: "Sick", es: "他生病了。", em: "He is sick." },
    { h: "休息", p: "Xiūxi", m: "Rest", es: "你需要休息。", em: "You need to rest." },
    { h: "健康", p: "Jiànkāng", m: "Health/Healthy", es: "祝你身体健康。", em: "Wish you good health." },
    { h: "看病", p: "Kànbìng", m: "See a doctor", es: "我要去看病。", em: "I need to see a doctor." }
  ],
  "Animals": [
    { h: "狗", p: "Gǒu", m: "Dog", es: "我有一只狗。", em: "I have a dog." },
    { h: "猫", p: "Māo", m: "Cat", es: "猫喜欢睡觉。", em: "Cats like to sleep." },
    { h: "鸟", p: "Niǎo", m: "Bird", es: "鸟在飞。", em: "Birds are flying." },
    { h: "熊猫", p: "Xióngmāo", m: "Panda", es: "熊猫很可爱。", em: "Pandas are cute." },
    { h: "鱼", p: "Yú", m: "Fish", es: "水里有鱼。", em: "There are fish in the water." },
    { h: "马", p: "Mǎ", m: "Horse", es: "他会骑马。", em: "He can ride a horse." },
    { h: "牛", p: "Niú", m: "Cow", es: "牛吃草。", em: "Cows eat grass." },
    { h: "动物", p: "Dòngwù", m: "Animal", es: "我喜欢小动物。", em: "I like small animals." },
    { h: "羊", p: "Yáng", m: "Sheep/Goat", es: "山上有羊。", em: "There are sheep on the mountain." },
    { h: "龙", p: "Lóng", m: "Dragon", es: "今年是龙年。", em: "This year is the Year of the Dragon." }
  ],
  "Common Verbs": [
    { h: "吃", p: "Chī", m: "Eat", es: "你吃饭了吗？", em: "Have you eaten?" },
    { h: "喝", p: "Hē", m: "Drink", es: "喝水。", em: "Drink water." },
    { h: "看", p: "Kàn", m: "Look/See/Watch", es: "看电视。", em: "Watch TV." },
    { h: "听", p: "Tīng", m: "Listen", es: "听音乐。", em: "Listen to music." },
    { h: "说", p: "Shuō", m: "Speak", es: "请说中文。", em: "Please speak Chinese." },
    { h: "读", p: "Dú", m: "Read", es: "读书。", em: "Read a book." },
    { h: "写", p: "Xiě", m: "Write", es: "写名字。", em: "Write name." },
    { h: "坐", p: "Zuò", m: "Sit", es: "请坐。", em: "Please sit." },
    { h: "站", p: "Zhàn", m: "Stand", es: "站起来。", em: "Stand up." },
    { h: "走", p: "Zǒu", m: "Walk", es: "我们走吧。", em: "Let's go." },
    { h: "跑", p: "Pǎo", m: "Run", es: "他跑得很快。", em: "He runs fast." },
    { h: "想", p: "Xiǎng", m: "Think/Want", es: "我想去。", em: "I want to go." },
    { h: "做", p: "Zuò", m: "Do/Make", es: "你在做什么？", em: "What are you doing?" },
    { h: "玩", p: "Wán", m: "Play", es: "去玩游戏。", em: "Go play games." },
    { h: "学", p: "Xué", m: "Study", es: "学中文。", em: "Study Chinese." }
  ],
  "Food & Drink": [
    { h: "水", p: "Shuǐ", m: "Water", es: "请给我一杯水。", em: "Please give me a glass of water." },
    { h: "茶", p: "Chá", m: "Tea", es: "中国人喜欢喝茶。", em: "Chinese people like to drink tea." },
    { h: "咖啡", p: "Kāfēi", m: "Coffee", es: "我要一杯热咖啡。", em: "I want a cup of hot coffee." },
    { h: "米饭", p: "Mǐfàn", m: "Rice (cooked)", es: "我不喜欢吃米饭。", em: "I don't like eating rice." },
    { h: "面条", p: "Miàntiáo", m: "Noodles", es: "这碗面条很好吃。", em: "This bowl of noodles is delicious." },
    { h: "面包", p: "Miànbāo", m: "Bread", es: "早餐我吃面包。", em: "I eat bread for breakfast." },
    { h: "牛奶", p: "Niúnǎi", m: "Milk", es: "睡觉前喝牛奶。", em: "Drink milk before sleep." },
    { h: "鸡蛋", p: "Jīdàn", m: "Egg", es: "我要两个鸡蛋。", em: "I want two eggs." },
    { h: "菜", p: "Cài", m: "Dish / Vegetable", es: "这个菜很辣。", em: "This dish is very spicy." },
    { h: "好吃", p: "Hǎochī", m: "Delicious", es: "中国菜很好吃。", em: "Chinese food is delicious." },
    { h: "苹果", p: "Píngguǒ", m: "Apple", es: "一天一苹果。", em: "An apple a day." },
    { h: "香蕉", p: "Xiāngjiāo", m: "Banana", es: "猴子爱吃香蕉。", em: "Monkeys love bananas." },
    { h: "西瓜", p: "Xīguā", m: "Watermelon", es: "夏天吃西瓜。", em: "Eat watermelon in summer." },
    { h: "水果", p: "Shuǐguǒ", m: "Fruit", es: "多吃水果对身体好。", em: "Eating fruit is good for health." },
    { h: "牛肉", p: "Niúròu", m: "Beef", es: "我不吃牛肉。", em: "I don't eat beef." },
    { h: "鸡肉", p: "Jīròu", m: "Chicken meat", es: "鸡肉很便宜。", em: "Chicken is cheap." },
    { h: "猪肉", p: "Zhūròu", m: "Pork", es: "这是猪肉饺子。", em: "These are pork dumplings." },
    { h: "啤酒", p: "Píjiǔ", m: "Beer", es: "我们要一瓶啤酒。", em: "We want a bottle of beer." },
    { h: "果汁", p: "Guǒzhī", m: "Juice", es: "我要橙汁。", em: "I want orange juice." },
    { h: "筷子", p: "Kuàizi", m: "Chopsticks", es: "你会用筷子吗？", em: "Can you use chopsticks?" },
    { h: "饭馆", p: "Fànguǎn", m: "Restaurant", es: "这家饭馆很有名。", em: "This restaurant is famous." },
    { h: "菜单", p: "Càidān", m: "Menu", es: "请给我菜单。", em: "Please give me the menu." },
    { h: "买单", p: "Mǎidān", m: "Pay the bill", es: "服务员，买单。", em: "Waiter, bill please." },
    { h: "火锅", p: "Huǒguō", m: "Hotpot", es: "我们去吃火锅吧。", em: "Let's go eat hotpot." },
    { h: "汤", p: "Tāng", m: "Soup", es: "我想喝汤。", em: "I want to drink soup." },
  ],
  "Travel & Places": [
    { h: "去", p: "Qù", m: "To go", es: "我想去北京。", em: "I want to go to Beijing." },
    { h: "来", p: "Lái", m: "To come", es: "你什么时候来？", em: "When are you coming?" },
    { h: "中国", p: "Zhōngguó", m: "China", es: "中国很大。", em: "China is very big." },
    { h: "北京", p: "Běijīng", m: "Beijing", es: "北京是中国的首都。", em: "Beijing is the capital of China." },
    { h: "上海", p: "Shànghǎi", m: "Shanghai", es: "上海很现代。", em: "Shanghai is very modern." },
    { h: "飞机", p: "Fēijī", m: "Airplane", es: "我坐飞机去上海。", em: "I take a plane to Shanghai." },
    { h: "火车", p: "Huǒchē", m: "Train", es: "火车站很远。", em: "The train station is far." },
    { h: "出租车", p: "Chūzūchē", m: "Taxi", es: "我们可以坐出租车。", em: "We can take a taxi." },
    { h: "路", p: "Lù", m: "Road/Way", es: "我在路上。", em: "I am on the way." },
    { h: "酒店", p: "Jiǔdiàn", m: "Hotel", es: "这个酒店很贵。", em: "This hotel is expensive." },
    { h: "房间", p: "Fángjiān", m: "Room", es: "我要一个大房间。", em: "I want a big room." },
    { h: "地图", p: "Dìtú", m: "Map", es: "你看地图吗？", em: "Do you look at the map?" },
    { h: "洗手间", p: "Xǐshǒujiān", m: "Restroom", es: "洗手间在哪里？", em: "Where is the restroom?" },
    { h: "哪里", p: "Nǎlǐ", m: "Where", es: "你去哪里？", em: "Where are you going?" },
    { h: "这里", p: "Zhèlǐ", m: "Here", es: "这里很漂亮。", em: "Here is very beautiful." },
    { h: "那里", p: "Nàlǐ", m: "There", es: "那里的菜好吃。", em: "The food there is tasty." },
    { h: "护照", p: "Hùzhào", m: "Passport", es: "这是我的护照。", em: "This is my passport." },
    { h: "票", p: "Piào", m: "Ticket", es: "我要买一张票。", em: "I want to buy a ticket." },
    { h: "地铁", p: "Dìtiě", m: "Subway", es: "坐地铁很快。", em: "Taking the subway is fast." },
    { h: "公交车", p: "Gōngjiāochē", m: "Bus", es: "公交车人很多。", em: "The bus has many people." },
    { h: "机场", p: "Jīchǎng", m: "Airport", es: "我要去机场。", em: "I need to go to the airport." },
    { h: "公园", p: "Gōngyuán", m: "Park", es: "我们在公园跑步。", em: "We run in the park." }
  ],
  "Family & People": [
    { h: "爸爸", p: "Bàba", m: "Dad", es: "我爸爸是医生。", em: "My dad is a doctor." },
    { h: "妈妈", p: "Māma", m: "Mom", es: "我爱我的妈妈。", em: "I love my mom." },
    { h: "儿子", p: "Érzi", m: "Son", es: "他有一个儿子。", em: "He has a son." },
    { h: "女儿", p: "Nǚ'ér", m: "Daughter", es: "他的女儿很可爱。", em: "His daughter is cute." },
    { h: "老师", p: "Lǎoshī", m: "Teacher", es: "王老师很好。", em: "Teacher Wang is good." },
    { h: "学生", p: "Xuésheng", m: "Student", es: "我是大学生。", em: "I am a university student." },
    { h: "朋友", p: "Péngyou", m: "Friend", es: "我们是好朋友。", em: "We are good friends." },
    { h: "医生", p: "Yīshēng", m: "Doctor", es: "他在医院看医生。", em: "He is seeing a doctor at the hospital." },
    { h: "先生", p: "Xiānsheng", m: "Mr. / Husband", es: "王先生在吗？", em: "Is Mr. Wang here?" },
    { h: "小姐", p: "Xiǎojiě", m: "Miss", es: "李小姐你好。", em: "Hello, Miss Li." },
    { h: "人", p: "Rén", m: "Person", es: "你是哪里人？", em: "Where are you from?" },
    { h: "孩子", p: "Háizi", m: "Child", es: "孩子在玩。", em: "The child is playing." },
    { h: "男", p: "Nán", m: "Male", es: "那个男孩是谁？", em: "Who is that boy?" },
    { h: "女", p: "Nǚ", m: "Female", es: "她是我的女朋友。", em: "She is my girlfriend." },
    { h: "大家", p: "Dàjiā", m: "Everyone", es: "大家好。", em: "Hello everyone." },
    { h: "家人", p: "Jiārén", m: "Family member", es: "我和家人吃饭。", em: "I eat with family." },
    { h: "哥哥", p: "Gēge", m: "Older brother", es: "我没有哥哥。", em: "I don't have an older brother." },
    { h: "姐姐", p: "Jiějie", m: "Older sister", es: "姐姐比我大。", em: "Older sister is older than me." },
    { h: "弟弟", p: "Dìdi", m: "Younger brother", es: "弟弟在学校。", em: "Younger brother is at school." },
    { h: "妹妹", p: "Mèimei", m: "Younger sister", es: "妹妹喜欢唱歌。", em: "Younger sister likes singing." },
  ],
  "Daily Objects": [
    { h: "书", p: "Shū", m: "Book", es: "我看书。", em: "I read a book." },
    { h: "手机", p: "Shǒujī", m: "Mobile phone", es: "你的手机在哪里？", em: "Where is your phone?" },
    { h: "电脑", p: "Diànnǎo", m: "Computer", es: "我用电脑工作。", em: "I use a computer to work." },
    { h: "杯子", p: "Bēizi", m: "Cup/Glass", es: "这个杯子很漂亮。", em: "This cup is beautiful." },
    { h: "桌子", p: "Zhuōzi", m: "Table", es: "书在桌子上。", em: "The book is on the table." },
    { h: "椅子", p: "Yǐzi", m: "Chair", es: "请坐椅子。", em: "Please sit on the chair." },
    { h: "衣服", p: "Yīfu", m: "Clothes", es: "我要买衣服。", em: "I want to buy clothes." },
    { h: "钱", p: "Qián", m: "Money", es: "我没有钱。", em: "I don't have money." },
    { h: "东西", p: "Dōngxi", m: "Thing", es: "这是什么东西？", em: "What is this thing?" },
    { h: "家", p: "Jiā", m: "Home/Family", es: "我想回家。", em: "I want to go home." },
    { h: "学校", p: "Xuéxiào", m: "School", es: "学校很大。", em: "The school is big." },
    { h: "商店", p: "Shāngdiàn", m: "Store", es: "商店关门了。", em: "The store is closed." },
    { h: "医院", p: "Yīyuàn", m: "Hospital", es: "他在医院。", em: "He is in the hospital." },
    { h: "工作", p: "Gōngzuò", m: "Job/Work", es: "你的工作是什么？", em: "What is your job?" },
    { h: "笔", p: "Bǐ", m: "Pen", es: "我有一支笔。", em: "I have a pen." },
    { h: "包", p: "Bāo", m: "Bag", es: "这是我的包。", em: "This is my bag." },
    { h: "床", p: "Chuáng", m: "Bed", es: "我在床上。", em: "I am on the bed." },
    { h: "门", p: "Mén", m: "Door", es: "请关门。", em: "Please close the door." },
    { h: "窗户", p: "Chuānghu", m: "Window", es: "打开窗户。", em: "Open the window." },
    { h: "灯", p: "Dēng", m: "Light", es: "关灯。", em: "Turn off the light." }
  ],
  "Adjectives & Colors": [
    { h: "爱", p: "Ài", m: "Love", es: "我爱你。", em: "I love you." },
    { h: "喜欢", p: "Xǐhuan", m: "Like", es: "我喜欢你。", em: "I like you." },
    { h: "累", p: "Lèi", m: "Tired", es: "我很累。", em: "I am very tired." },
    { h: "忙", p: "Máng", m: "Busy", es: "今天很忙。", em: "Today is busy." },
    { h: "漂亮", p: "Piàoliang", m: "Beautiful", es: "她很漂亮。", em: "She is beautiful." },
    { h: "帅", p: "Shuài", m: "Handsome", es: "他很帅。", em: "He is handsome." },
    { h: "热", p: "Rè", m: "Hot", es: "天气很热。", em: "The weather is hot." },
    { h: "冷", p: "Lěng", m: "Cold", es: "我不冷。", em: "I am not cold." },
    { h: "大", p: "Dà", m: "Big", es: "这个苹果很大。", em: "This apple is big." },
    { h: "小", p: "Xiǎo", m: "Small", es: "这个房间很小。", em: "This room is small." },
    { h: "多", p: "Duō", m: "Many/Much", es: "人很多。", em: "Many people." },
    { h: "少", p: "Shǎo", m: "Few/Little", es: "钱很少。", em: "Little money." },
    { h: "新", p: "Xīn", m: "New", es: "新衣服。", em: "New clothes." },
    { h: "旧", p: "Jiù", m: "Old", es: "旧书。", em: "Old book." },
    { h: "红", p: "Hóng", m: "Red", es: "红色的车。", em: "Red car." },
    { h: "白", p: "Bái", m: "White", es: "白色的云。", em: "White clouds." },
    { h: "黑", p: "Hēi", m: "Black", es: "黑色的狗。", em: "Black dog." },
    { h: "蓝", p: "Lán", m: "Blue", es: "蓝天。", em: "Blue sky." },
    { h: "绿", p: "Lǜ", m: "Green", es: "绿茶。", em: "Green tea." },
    { h: "黄", p: "Huáng", m: "Yellow", es: "黄色的花。", em: "Yellow flower." },
    { h: "快乐", p: "Kuàilè", m: "Happy", es: "生日快乐。", em: "Happy birthday." },
    { h: "难", p: "Nán", m: "Difficult", es: "中文很难。", em: "Chinese is difficult." },
    { h: "容易", p: "Róngyì", m: "Easy", es: "这很容易。", em: "This is easy." },
    { h: "干净", p: "Gānjìng", m: "Clean", es: "房间很干净。", em: "The room is clean." }
  ],
  "Shopping & Money": [
    { h: "买", p: "Mǎi", m: "Buy", es: "我要买这个。", em: "I want to buy this." },
    { h: "卖", p: "Mài", m: "Sell", es: "这里卖水果吗？", em: "Do you sell fruit here?" },
    { h: "贵", p: "Guì", m: "Expensive", es: "太贵了！", em: "Too expensive!" },
    { h: "便宜", p: "Piányi", m: "Cheap", es: "便宜一点吧。", em: "Make it a bit cheaper." },
    { h: "多少钱", p: "Duōshao qián", m: "How much money", es: "这个多少钱？", em: "How much is this?" },
    { h: "现金", p: "Xiànjīn", m: "Cash", es: "我付现金。", em: "I pay cash." },
    { h: "信用卡", p: "Xìnyòngkǎ", m: "Credit card", es: "可以刷信用卡吗？", em: "Can I swipe a credit card?" },
    { h: "超市", p: "Chāoshì", m: "Supermarket", es: "我去超市买东西。", em: "I go to the supermarket to buy things." },
    { h: "袋子", p: "Dàizi", m: "Bag", es: "要袋子吗？", em: "Do you want a bag?" },
    { h: "试", p: "Shì", m: "Try", es: "我可以试一下吗？", em: "Can I try it?" }
  ],
  "Weather & Nature": [
    { h: "天", p: "Tiān", m: "Sky/Day", es: "天很蓝。", em: "The sky is very blue." },
    { h: "下雨", p: "Xiàyǔ", m: "Rain", es: "今天下雨。", em: "It is raining today." },
    { h: "下雪", p: "Xiàxuě", m: "Snow", es: "冬天下雪。", em: "It snows in winter." },
    { h: "风", p: "Fēng", m: "Wind", es: "风很大。", em: "The wind is strong." },
    { h: "太阳", p: "Tàiyáng", m: "Sun", es: "太阳出来了。", em: "The sun came out." },
    { h: "月亮", p: "Yuèliang", m: "Moon", es: "月亮很圆。", em: "The moon is round." },
    { h: "树", p: "Shù", m: "Tree", es: "那是一棵树。", em: "That is a tree." },
    { h: "花", p: "Huā", m: "Flower", es: "花很香。", em: "The flower smells good." },
    { h: "山", p: "Shān", m: "Mountain", es: "我们去爬山。", em: "We go climb the mountain." },
    { h: "河", p: "Hé", m: "River", es: "河水很清。", em: "The river water is clear." }
  ],
  "Emergency & Health": [
    { h: "救命", p: "Jiùmìng", m: "Help!", es: "救命啊！", em: "Help!" },
    { h: "警察", p: "Jǐngchá", m: "Police", es: "叫警察。", em: "Call the police." },
    { h: "危险", p: "Wēixiǎn", m: "Dangerous", es: "这里很危险。", em: "Here is very dangerous." },
    { h: "疼", p: "Téng", m: "Pain/Hurt", es: "我的头很疼。", em: "My head hurts." },
    { h: "药", p: "Yào", m: "Medicine", es: "吃药了吗？", em: "Have you taken medicine?" },
    { h: "发烧", p: "Fāshāo", m: "Fever", es: "我发烧了。", em: "I have a fever." },
    { h: "感冒", p: "Gǎnmào", m: "Cold (illness)", es: "他感冒了。", em: "He has a cold." },
    { h: "小心", p: "Xiǎoxīn", m: "Be careful", es: "过马路要小心。", em: "Be careful crossing the road." },
    { h: "停", p: "Tíng", m: "Stop", es: "停车！", em: "Stop the car!" },
    { h: "问题", p: "Wèntí", m: "Question/Problem", es: "我有一个问题。", em: "I have a question." }
  ]
};

// Helper function to convert raw words to Lesson structure
const createVocabularyLesson = (title: string, desc: string, level: Lesson['level'], rawWords: RawWord[], locked: boolean = false): Lesson => ({
  id: uid(),
  title,
  description: desc,
  level,
  type: ContentType.VOCABULARY,
  isLocked: locked,
  content: rawWords.map(w => ({
    id: uid(),
    hanzi: w.h,
    pinyin: w.p,
    meaning: w.m,
    exampleSentence: w.es,
    exampleMeaning: w.em
  }))
});

export const MOCK_LESSONS: Lesson[] = [
  // BEGINNER
  createVocabularyLesson('Greetings & Essentials', 'Start here: Hello, Thank you, and basics.', 'Beginner', VOCAB_DATABASE["Greetings & Essentials"]),
  createVocabularyLesson('Numbers & Time', 'Count to ten and tell the time.', 'Beginner', VOCAB_DATABASE["Numbers & Time"]),
  createVocabularyLesson('Family & People', 'Talking about family and people.', 'Beginner', VOCAB_DATABASE["Family & People"]),
  createVocabularyLesson('Body & Health', 'Parts of the body and feeling sick.', 'Beginner', VOCAB_DATABASE["Body & Health"]),
  createVocabularyLesson('Common Verbs', 'Action words you need to know.', 'Beginner', VOCAB_DATABASE["Common Verbs"]),

  // INTERMEDIATE
  createVocabularyLesson('Food & Drink', 'Ordering food and naming ingredients.', 'Intermediate', VOCAB_DATABASE["Food & Drink"]),
  createVocabularyLesson('Daily Objects', 'Common objects you use every day.', 'Intermediate', VOCAB_DATABASE["Daily Objects"]),
  createVocabularyLesson('Adjectives & Colors', 'Express yourself and describe things.', 'Intermediate', VOCAB_DATABASE["Adjectives & Colors"]),
  createVocabularyLesson('Shopping & Money', 'Bargaining and buying things.', 'Intermediate', VOCAB_DATABASE["Shopping & Money"]),
  createVocabularyLesson('Animals', 'Pets and wild animals.', 'Intermediate', VOCAB_DATABASE["Animals"]),

  // ADVANCED
  createVocabularyLesson('Travel & Places', 'Getting around China like a pro.', 'Advanced', VOCAB_DATABASE["Travel & Places"]),
  createVocabularyLesson('Weather & Nature', 'Talking about the environment.', 'Advanced', VOCAB_DATABASE["Weather & Nature"]),
  createVocabularyLesson('Emergency & Safety', 'Important words for safety.', 'Advanced', VOCAB_DATABASE["Emergency & Health"]),
  
  // DIALOGUES
  {
    id: uid(),
    title: 'Ordering Coffee',
    description: 'A daily conversation at a cafe.',
    level: 'Beginner',
    type: ContentType.DIALOGUE,
    isLocked: false,
    content: {
      id: 'd1',
      title: 'At the Cafe',
      lines: [
        {
          speaker: 'A',
          hanzi: '你好，我要一杯拿铁。',
          pinyin: 'Nǐ hǎo, wǒ yào yībēi nátiě.',
          meaning: 'Hello, I would like a latte.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        },
        {
          speaker: 'B',
          hanzi: '好的，要热的还是冰的？',
          pinyin: 'Hǎode, yào rè de háishì bīng de?',
          meaning: 'Okay, hot or iced?',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
        },
        {
          speaker: 'A',
          hanzi: '要冰的，谢谢。',
          pinyin: 'Yào bīng de, xièxie.',
          meaning: 'Iced, thank you.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        },
        {
           speaker: 'B',
           hanzi: '一共三十块。',
           pinyin: 'Yígòng sānshí kuài.',
           meaning: 'That will be 30 yuan in total.',
           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
        }
      ]
    }
  },
  {
    id: uid(),
    title: 'Asking Directions',
    description: 'How to find the subway station.',
    level: 'Intermediate',
    type: ContentType.DIALOGUE,
    isLocked: false,
    content: {
      id: 'd2',
      title: 'Where is the Subway?',
      lines: [
        {
            speaker: 'A',
            hanzi: '请问，地铁站在哪里？',
            pinyin: 'Qǐngwèn, dìtiě zhàn zài nǎlǐ?',
            meaning: 'Excuse me, where is the subway station?',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        },
        {
            speaker: 'B',
            hanzi: '一直走，然后向右转。',
            pinyin: 'Yìzhí zǒu, ránhòu xiàng yòu zhuǎn.',
            meaning: 'Go straight, then turn right.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
        },
        {
            speaker: 'A',
            hanzi: '远吗？',
            pinyin: 'Yuǎn ma?',
            meaning: 'Is it far?',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        },
        {
            speaker: 'B',
            hanzi: '不远，走路五分钟。',
            pinyin: 'Bù yuǎn, zǒulù wǔ fēnzhōng.',
            meaning: 'Not far, 5 minutes walk.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
        }
      ]
    }
  },

  // QUIZZES
  {
    id: uid(),
    title: 'Basic Grammar Quiz',
    description: 'Test your knowledge on sentence structure.',
    level: 'Beginner',
    type: ContentType.QUIZ,
    isLocked: false,
    content: [
      {
        id: uid(),
        question: 'Which is the correct way to say "I am American"?',
        options: ['我是美国人 (Wǒ shì Měiguórén)', '我美国人是 (Wǒ Měiguórén shì)', '是我是美国人 (Shì wǒ shì Měiguórén)', '美国人是我 (Měiguórén shì wǒ)'],
        correctAnswer: 0,
        explanation: 'The structure is Subject + 是 (verb to be) + Noun.'
      },
      {
        id: uid(),
        question: 'How do you ask "How are you?"',
        options: ['你叫什么？ (Nǐ jiào shénme?)', '你好吗？ (Nǐ hǎo ma?)', '这是什么？ (Zhè shì shénme?)', '哪怕？ (Nǎ pà?)'],
        correctAnswer: 1,
        explanation: '"吗" (ma) is a particle used at the end of a sentence to turn a statement into a yes/no question.'
      },
      {
          id: uid(),
          question: 'Translate: "He is not busy."',
          options: ['他不忙 (Tā bù máng)', '他没忙 (Tā méi máng)', '他非忙 (Tā fēi máng)', '不他忙 (Bù tā máng)'],
          correctAnswer: 0,
          explanation: 'Use "不" (bù) to negate adjectives and present/future verbs.'
      }
    ]
  },
  {
      id: uid(),
      title: 'Vocabulary Challenge',
      description: 'Test your word knowledge.',
      level: 'Intermediate',
      type: ContentType.QUIZ,
      isLocked: false,
      content: [
          {
              id: uid(),
              question: 'What is "Airplane" in Chinese?',
              options: ['手机 (Shǒujī)', '飞机 (Fēijī)', '司机 (Sījī)', '电视 (Diànshì)'],
              correctAnswer: 1,
              explanation: 'Fei (Fly) + Ji (Machine) = Airplane.'
          },
          {
              id: uid(),
              question: 'Which word means "Delicious"?',
              options: ['好喝 (Hǎohē)', '好看 (Hǎokàn)', '好吃 (Hǎochī)', '好听 (Hǎotīng)'],
              correctAnswer: 2,
              explanation: 'Chi means eat. Haochi means "good to eat".'
          }
      ]
  }
];