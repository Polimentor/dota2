<template>
    <div class="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div class="flex justify-center relative w-[1224px] mb-16">
            <button
                v-if="!isOpenClues"
                class="absolute top-6 right-0 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                @click="isOpenClues=true"
            >
                🐓 Rooster
            </button>
            <h1 class="text-[48px] font-bold text-indigo-600 text-center">Guess the Dota 2 hero</h1>
            <img
                v-if="isOpenClues || isGameOver"
                class="rounded-full absolute -top-8 -right-2"
                :src="`https://cdn.cloudflare.steamstatic.com/${imagesHeroes[randomNumbers]}`"
                alt=""
            >
        </div>
        <div>
            <div class="flex flex-col items-center">
                <div class="flex flex-col items-center bg-gray-800 rounded-lg shadow-lg border-4 border-gray-700 p-2 w-max mb-16">
                    <div class="bg-indigo-300 px-6 py-4 rounded-lg shadow-inner border border-gray-400 relative w-max">
                        <p class="text-[68px] text-white border-2 border-transparent font-mono tracking-widest">
                            {{ word }}
                        </p>
                    </div>
                    <div class="bg-gray-700 w-16 h-2 mt-4 rounded"></div>
                    <div class="bg-gray-800 w-10 h-2 rounded-b-lg"></div>
                    <div class="flex gap-2">
                        <span
                            v-for="(heart, index) in maxAttempts"
                            :key="index"
                            class="text-[28px] transition-all"
                            :class="heart ? 'text-red-500' : 'text-gray-400'"
                        >
                            ❤️
                        </span>
                    </div>
                </div>
                <div class="flex flex-col flex-wrap justify-start gap-4 my-4 wrapper shadow-xl">
                    <div
                        v-for="(row, rowIndex) in keyboard"
                        :key="rowIndex"
                        class="flex gap-4"
                    >
                    <span
                        v-for="(key, keyIndex) in row"
                        :key="keyIndex"
                        @click="checkLetter(key)"
                        :class="[{'!bg-[#FFF9C4] !cursor-not-allowed':isDisabledWord(key)}, {'!bg-gray-500 !cursor-not-allowed':disabled}]"
                        class="bg-[#E0E0E0] text-[#1A237E] text-[48px] rounded-lg cursor-pointer border border-transparent hover:border-[#BBDEFB] h-[100px] min-w-[100px] flex items-center justify-center opacity-90"
                    >
                        {{ key.toUpperCase() }}
                    </span>
                        <span
                            @click="newPlay"
                            v-if="rowIndex === 2"
                            class="bg-[#C8E6C9] text-[#1A237E] text-[36px] 2xl:text-[48px] rounded-lg cursor-pointer border border-transparent hover:bg-[#A5D6A7] h-[100px] w-full flex items-center justify-center"
                        >
                        New Game
                    </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { fetchHeroes } from "@/heroes";
import confetti from 'canvas-confetti';
const selectedLetter = ref('')
const guessedLetters = ref([]);
const usedAttempts = ref(0);
const maxAttempts = ref( 5);
const heroes = ref([]);
const randomNumbers = ref(0)
const isOpenClues = ref(false);
const keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '-'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const disabled = computed(() => usedAttempts.value >= maxAttempts.value);
const isDisabledWord = (key) => guessedLetters.value.includes(key);
const randomInteger = (min, max) => randomNumbers.value = Math.floor(Math.random() * (max + 1 - min))

onMounted(async () => {
    try {
        heroes.value = await fetchHeroes();
        randomInteger(0, heroes.value.length - 1);
    } catch (err) {
        console.error(err);
    }
});

const launchConfetti = () => {
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 }
    });
};

const checkLetter = (key) => {
    if (maxAttempts.value <= 0) return
    selectedLetter.value = key
    if(!currentWord.value.includes(key)) {
        maxAttempts.value--
    }
    guessedLetters.value.push(key.toLowerCase());
};

const newPlay = () => {
    maxAttempts.value = 5;
    guessedLetters.value = [];
    randomInteger(0, heroes.value.length - 1);
    isOpenClues.value = false
};

const word = computed(() => currentWord.value.split("").map((l) => (guessedLetters.value.includes(l) ? l : "_")).join(" ").toUpperCase())
const isGameOver = computed(() => !word.value.split('').includes('_'));
const currentWord = computed(() => nameHeroes.value[randomNumbers.value] || "")
const nameHeroes = computed(() => heroes.value.map((hero) => hero.localized_name.replace(" ", "").toLowerCase()));
const imagesHeroes = computed(() => heroes.value.map((hero) => hero.img));

watch(isGameOver, (newValue) => {
    if (newValue) {
        launchConfetti();
    }
});
</script>

<style scoped>

.wrapper {
    max-width: 100%;
    margin: 0 auto;
    padding: 40px;
    text-align: center;
    font-family: Arial, sans-serif;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-image: url('./assets/bg-dota.jpg');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
</style>
