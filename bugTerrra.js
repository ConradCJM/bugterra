require(dotenv).config()
const SUPABASE_URL = process.env.SUPABASE_URL; //THIS IS NOT SETUP
const SUPABASE_KEY = process.env.SUPABASE_KEY; //THIS IS SETUP

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// CREATE BUG
async function createBug() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const notes = document.getElementById("notes").value;

  if (!title || !category || !priority) {
    alert("Missing required fields");
    return;
  }

  const { error } = await supabase
    .from("bugs")
    .insert([{ title, category, priority, notes }]);

  if (error) {
    alert("Error adding bug");
    console.log(error);
  } else {
    alert("Bug added!");
    loadBugs();
  }
}

// LOAD BUGS (Dashboard)
async function loadBugs() {
  const { data, error } = await supabase
    .from("bugs")
    .select("*")
    .order("created_at", { ascending: false });

  const bugList = document.getElementById("bugList");
  bugList.innerHTML = "";

  data.forEach(bug => {
    const div = document.createElement("div");
    div.className = "bug";

    div.innerHTML = `
      <strong>${bug.title}</strong><br>
      Category: ${bug.category}<br>
      Priority: ${bug.priority}<br>
      Notes: ${bug.notes || "None"}
    `;

    bugList.appendChild(div);
  });
}

// LOAD ON START
loadBugs();