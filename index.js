
const CELLS = ["green", "red", "yellow", "blue"];
const OUTSIDE_SHADOW_CLASS = "outside-shadow";
const INSIDE_SHADOW_CLASS = "inside-shadow";
/////////////
let level;
let game_over;
let sequence;

function initialize_data() {
  level = 1;
  game_over = false;
  sequence = [];
}
function get_next_number() {
  return Math.floor(Math.random() * CELLS.length) + 1;
}
function effect_remove_class_from_cell(cell, class_name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      $(`.${cell}`).removeClass(class_name);
      resolve();
    }, 500 - level * 10);
  });
}
function update_level() {
  $("h2").text(`Level: ${level++}`);
}
async function play_effect_for_cell(cell_id,cell_class){
    $(`.${cell_id}`).addClass(cell_class);
    await effect_remove_class_from_cell(cell_id, cell_class);
}

async function start() {
  while (!game_over && level <= 20) {
    update_level();
    let cell = CELLS[get_next_number() - 1];
    sequence.push(cell);
    await play_effect_for_cell(cell,OUTSIDE_SHADOW_CLASS);
    await play_effect_for_cell(cell,INSIDE_SHADOW_CLASS);
  }
}

$(document).on("keypress", () => {
  initialize_data();
  start();
});
