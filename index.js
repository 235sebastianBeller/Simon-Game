
const CELLS = ["green", "red", "yellow", "blue"];
const OUTSIDE_SHADOW_CLASS = "outside-shadow";
const INSIDE_SHADOW_CLASS = "inside-shadow";
/////////////
let level;
let game_over=true;
let sequence;
let user_sequence;

function initialize_data() {
  level = 1;
  game_over = false;
  sequence = [];
  user_sequence=[];

}
function get_next_number() {
  return Math.floor(Math.random() * CELLS.length) + 1;
}
function effect_remove_class_from_cell(cell, class_name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      $(`.${cell}`).removeClass(class_name);
      resolve();
    }, Math.max(1000 - level*25 ,200));
  });
}
function update_level() {
  $("h2").text(`Level: ${level++}`);
}
async function play_effect_for_cell(cell_id,cell_class){
    $(`.${cell_id}`).addClass(cell_class);
    await effect_remove_class_from_cell(cell_id, cell_class);
}

async function show_sequence(){
    for (let cell of sequence){
        await play_effect_for_cell(cell,OUTSIDE_SHADOW_CLASS);
        await play_effect_for_cell(cell,INSIDE_SHADOW_CLASS);
    }
}
async function start_level() {
  update_level();
  let cell = CELLS[get_next_number() - 1];
  sequence.push(cell);
  console.log(cell)
  await show_sequence();
}

$(document).on("keypress", () => {
  if (game_over==true) {
      initialize_data();
      start_level();
  }
});


$(".button-grid").on("click", (event) => {
    user_sequence.push(event.target.classList[1])
    if(user_sequence.length==sequence.length){
        start_level();
        user_sequence=[]
    }
});
