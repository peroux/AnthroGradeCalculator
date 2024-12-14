// Weights for each category
const weights = {
  "Class Engagement": 0.20,
  "Discussion Board Posts and In-Class Assignments": 0.30,
  "Group Projects": 0.25,
  "Quiz": 0.10,
  "Assessment Prompts": 0.10,
  "Oral Presentation": 0.05,
};

// Grade boundaries
const grade_table = {
  "A": [94, 100],
  "AB": [88, 93],
  "B": [81, 87],
  "BC": [76, 80],
  "C": [71, 75],
  "CD": [66, 70],
  "D": [61, 65],
  "F": [0, 60],
};

document.getElementById("gradeForm").addEventListener("input", () => {
  // Gather values
  const getValueOrZero = (id) => parseFloat(document.getElementById(id).value) || 0;

  const ce_num = getValueOrZero("ce_numerator");
  const ce_den = getValueOrZero("ce_denominator");
  const ce_pct = ce_den ? (ce_num / ce_den) * 100 : 0;

  const db_num = getValueOrZero("db_numerator");
  const db_den = getValueOrZero("db_denominator");
  const db_pct = db_den ? (db_num / db_den) * 100 : 0;

  const assign_num = getValueOrZero("assign_numerator");
  const assign_den = getValueOrZero("assign_denominator");
  const assign_pct = assign_den ? (assign_num / assign_den) * 100 : 0;

  const gp_num = getValueOrZero("gp_numerator");
  const gp_den = getValueOrZero("gp_denominator");
  const gp_pct = gp_den ? (gp_num / gp_den) * 100 : 0;

  const quiz_num = getValueOrZero("quiz_numerator");
  const quiz_den = getValueOrZero("quiz_denominator");
  const quiz_pct = quiz_den ? (quiz_num / quiz_den) * 100 : 0;

  const race_num = getValueOrZero("race_numerator");
  const race_den = getValueOrZero("race_denominator");
  const race_pct = race_den ? (race_num / race_den) * 100 : 0;

  const gender_num = getValueOrZero("gender_numerator");
  const gender_den = getValueOrZero("gender_denominator");
  const gender_pct = gender_den ? (gender_num / gender_den) * 100 : 0;

  const op_num = getValueOrZero("op_numerator");
  const op_den = getValueOrZero("op_denominator");
  const op_pct = op_den ? (op_num / op_den) * 100 : 0;

  const ap_combined = (race_pct + gender_pct) / 2;

  // Calculate final grade
  const final_grade =
    ce_pct * weights["Class Engagement"] +
    ((db_pct + assign_pct) / 2) * weights["Discussion Board Posts and In-Class Assignments"] +
    gp_pct * weights["Group Projects"] +
    quiz_pct * weights["Quiz"] +
    ap_combined * weights["Assessment Prompts"] +
    op_pct * weights["Oral Presentation"];

  document.getElementById("results").innerHTML = `<p>Your current final grade is: ${final_grade.toFixed(2)}%</p>`;
});
