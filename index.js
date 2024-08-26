//  **********************************************************
//  * Project: Simon Game                                    *
//  * Autor: Sebastian Daniel Beller Sanzetenea              *
//  * Descripcion: A game to test your memory.               *
//  **********************************************************
const CELLS = ["green", "red", "yellow", "blue"];
const OUTSIDE_SHADOW_CLASS = "outside-shadow";
const INSIDE_SHADOW_CLASS = "inside-shadow";
const DELAY = 200;
const DELAY_CELL_EFFECT = 1000;
const WRONG_AUDIO_ID="wrong";

let level;
let game_over = true;
let sequence;
let user_sequence;

function initialize_data() {
  level = 1;
  game_over = false;
  sequence = [];
  user_sequence = [];
}

function get_delay_cell_effect() {
  return Math.max(DELAY_CELL_EFFECT - level * 25, DELAY);
}
function get_next_number() {
  return Math.floor(Math.random() * CELLS.length) + 1;
}
function effect_remove_class_from_cell(cell, class_name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      $(`.${cell}`).removeClass(class_name);
      resolve();
    }, get_delay_cell_effect());
  });
}

function play_audio(audio_id){
  let audio = new Audio(`sounds/${audio_id}.mp3`);
  audio.play();
}
function update_level() {
  $("h2").text(`Level: ${level++}`);
}
async function play_effect_for_cell(cell_id, cell_class) {
  if(game_over) return;
  $(`.${cell_id}`).addClass(cell_class);
  await effect_remove_class_from_cell(cell_id, cell_class);
}
async function show_sequence() {
  for (let cell of sequence) {
    await play_effect_for_cell(cell, OUTSIDE_SHADOW_CLASS);
    play_audio(cell);
    await play_effect_for_cell(cell, INSIDE_SHADOW_CLASS);
  }
}
async function start_level() {
  update_level();
  let cell = CELLS[get_next_number() - 1];
  sequence.push(cell);
  await show_sequence();
}
$(document).on("keypress", () => {
  if (game_over) {
    initialize_data();
    start_level();
  }
});

function remove_game_over_state() {
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, DELAY);
}
function show_game_over_state() {
  $("h2").text("Game Over, Press Any Key to Restart");
  $("body").addClass("game-over");
}

const is_the_same_sub_sequence = () => {
  let sliced_sequence = sequence.slice(0, user_sequence.length);
  return JSON.stringify(user_sequence) === JSON.stringify(sliced_sequence);
};
const is_the_same_sequence_length = () =>
  user_sequence.length == sequence.length;
function check_game_over(event) {
  let cell=event.target.classList[1]
  user_sequence.push(cell);
  play_audio(cell);
  if (!is_the_same_sub_sequence()) {
    game_over = true;
    show_game_over_state();
    remove_game_over_state();
    play_audio(WRONG_AUDIO_ID);
    return;
  }
  if (is_the_same_sequence_length()) {
    start_level();
    user_sequence = [];
  }
}


$(".button-grid").on("click", check_game_over);

