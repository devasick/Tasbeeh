import { Dhikr } from '../types';

/**
 * Predefined Dhikr list with authentic Hadith references
 * These are commonly recited after prayers and throughout the day
 */
export const PREDEFINED_DHIKR: Dhikr[] = [
  {
    id: 'dhikr-1',
    arabicText: 'سُبْحَانَ اللهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    recommendedCount: 33,
    hadithReference: 'Whoever says SubhanAllah 33 times, Alhamdulillah 33 times, and Allahu Akbar 34 times after every prayer, his sins will be forgiven even if they are like the foam of the sea.',
    hadithSource: 'Sahih Muslim 597',
  },
  {
    id: 'dhikr-2',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is due to Allah',
    recommendedCount: 33,
    hadithReference: 'To be recited 33 times after each obligatory prayer along with SubhanAllah and Allahu Akbar.',
    hadithSource: 'Sahih Muslim 597',
  },
  {
    id: 'dhikr-3',
    arabicText: 'اللهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    recommendedCount: 34,
    hadithReference: 'To be recited 34 times after each obligatory prayer, completing the set of 100 with SubhanAllah and Alhamdulillah.',
    hadithSource: 'Sahih Muslim 597',
  },
  {
    id: 'dhikr-4',
    arabicText: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    recommendedCount: 100,
    hadithReference: 'The Prophet (ﷺ) said: "By Allah! I seek forgiveness from Allah and repent to Him more than seventy times a day."',
    hadithSource: 'Sahih Bukhari 6307',
  },
  {
    id: 'dhikr-5',
    arabicText: 'لَا إِلَٰهَ إِلَّا اللهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'There is no god but Allah',
    recommendedCount: 100,
    hadithReference: 'Whoever says "La ilaha illallah" one hundred times a day will have the reward of freeing ten slaves, one hundred good deeds will be written for him and one hundred bad deeds will be erased.',
    hadithSource: 'Sahih Bukhari 3293, Sahih Muslim 2691',
  },
  {
    id: 'dhikr-6',
    arabicText: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    meaning: 'Glory be to Allah and praise be to Him',
    recommendedCount: 100,
    hadithReference: 'The Prophet (ﷺ) said: "Whoever says SubhanAllahi wa bihamdihi one hundred times a day, his sins will be forgiven even if they are like the foam of the sea."',
    hadithSource: 'Sahih Bukhari 6405, Sahih Muslim 2691',
  },
  {
    id: 'dhikr-7',
    arabicText: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَ اللهِ الْعَظِيمِ',
    transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil Azeem',
    meaning: 'Glory be to Allah and praise be to Him, Glory be to Allah the Supreme',
    recommendedCount: 10,
    hadithReference: 'The Prophet (ﷺ) said: "Two words are light on the tongue, heavy on the Scale, and beloved to the Most Merciful."',
    hadithSource: 'Sahih Bukhari 6406, Sahih Muslim 2694',
  },
  {
    id: 'dhikr-8',
    arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    meaning: 'There is no power and no strength except with Allah',
    recommendedCount: 10,
    hadithReference: 'The Prophet (ﷺ) said: "Shall I not tell you a word which is a treasure from the treasures of Paradise? La hawla wa la quwwata illa billah."',
    hadithSource: 'Sahih Bukhari 4205, Sahih Muslim 2704',
  },
  {
    id: 'dhikr-9',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    meaning: 'O Allah, send blessings upon Muhammad',
    recommendedCount: 10,
    hadithReference: 'The Prophet (ﷺ) said: "Whoever sends blessings upon me once, Allah will send blessings upon him ten times."',
    hadithSource: 'Sahih Muslim 384',
  },
  {
    id: 'dhikr-10',
    arabicText: 'حَسْبِيَ اللهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'Hasbiyallahu la ilaha illa Huwa, alayhi tawakkaltu wa Huwa Rabbul Arshil Azeem',
    meaning: 'Allah is sufficient for me. There is no god but Him. I have placed my trust in Him, and He is the Lord of the Magnificent Throne',
    recommendedCount: 7,
    hadithReference: 'The Prophet (ﷺ) said: "Whoever says this seven times in the morning and evening, Allah will take care of whatever worries him."',
    hadithSource: 'Abu Dawud 5081',
  },
  {
    id: 'dhikr-11',
    arabicText: 'رَضِيتُ بِاللهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا',
    transliteration: 'Radeetu billahi Rabban, wa bil-Islami deenan, wa bi-Muhammadin nabiyyan',
    meaning: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet',
    recommendedCount: 3,
    hadithReference: 'The Prophet (ﷺ) said: "Whoever says this three times in the morning and three times in the evening, it will be a right upon Allah to please him on the Day of Resurrection."',
    hadithSource: 'Ahmad, Abu Dawud 5072, Tirmidhi 3389',
  },
  {
    id: 'dhikr-12',
    arabicText: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama\'i, wa Huwas-Samee\'ul-\'Aleem',
    meaning: 'In the name of Allah, with whose name nothing can harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing',
    recommendedCount: 3,
    hadithReference: 'The Prophet (ﷺ) said: "Whoever says this three times will not be afflicted by any calamity until morning, and whoever says it three times in the morning will not be afflicted by any calamity until evening."',
    hadithSource: 'Abu Dawud 5088, Tirmidhi 3388',
  },
];

/**
 * Get a Dhikr by its ID
 */
export const getDhikrById = (id: string): Dhikr | undefined => {
  return PREDEFINED_DHIKR.find(dhikr => dhikr.id === id);
};

/**
 * Get all Dhikr sorted by recommended count
 */
export const getAllDhikrSorted = (): Dhikr[] => {
  return [...PREDEFINED_DHIKR].sort((a, b) => a.recommendedCount - b.recommendedCount);
};

/**
 * Get Dhikr by recommended count
 */
export const getDhikrByCount = (count: number): Dhikr[] => {
  return PREDEFINED_DHIKR.filter(dhikr => dhikr.recommendedCount === count);
};
