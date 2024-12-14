// Weights for each category
const weights = {
  "Class Engagement": 0.20,
  "Discussion Board Posts and In-Class Assignments": 0.30,
  "Group Projects": 0.25,
  "Quiz": 0.10,
  "Assessment Prompts": 0.10,
  "Oral Presentation": 0.05
};

// Total possible points per section
const section_point_table = {
  "Class Engagement": 100,
  "Discussion Board Posts": 270,
  "In-Class Assignments": 200,
  "Group Projects": 100,
  "Quiz": 100,
  "Oral Presentation": 100,
  "Race Assessment": 50,
  "Gender Assessment": 50,
  "Podcast": 120
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
  "F": [0, 60]
};

const useClassTotalsCheckbox = document.getElementById("useClassTotals");

// Helper function to set total fields based on checkbox
function updateTotals() {
  const useClassTotals = useClassTotalsCheckbox.checked;

  // Mapping input IDs to keys in section_point_table
  const mappings = [
    { numeratorId: "ce_numerator", denominatorId: "ce_denominator", key: "Class Engagement" },
    { numeratorId: "db_numerator", denominatorId: "db_denominator", key: "Discussion Board Posts" },
    { numeratorId: "assign_numerator", denominatorId: "assign_denominator", key: "In-Class Assignments" },
    { numeratorId: "podcast_numerator", denominatorId: "podcast_denominator", key: "Podcast" },
    { numeratorId: "gp_numerator", denominatorId: "gp_denominator", key: "Group Projects" },
    { numeratorId: "quiz_numerator", denominatorId: "quiz_denominator", key: "Quiz" },
    { numeratorId: "race_numerator", denominatorId: "race_denominator", key: "Race Assessment" },
    { numeratorId: "gender_numerator", denominatorId: "gender_denominator", key: "Gender Assessment" },
    { numeratorId: "op_numerator", denominatorId: "op_denominator", key: "Oral Presentation" }
  ];

  mappings.forEach(map => {
    const denomInput = document.getElementById(map.denominatorId);
    if (useClassTotals) {
      denomInput.value = section_point_table[map.key];
      denomInput.disabled = true;
    } else {
      // Clear the value and enable it again for user input
      denomInput.value = "";
      denomInput.disabled = false;
    }
  });
}

// Attach event listener for changing totals
useClassTotalsCheckbox.addEventListener('change', updateTotals);

// initialize on load
document.addEventListener('DOMContentLoaded', updateTotals);

function calculatePercentage(numerator, denominator) {
  if (denominator === 0 || isNaN(denominator)) return 0;
  return (numerator / denominator) * 100;
}

/**
 * Attempt to find how many extra credit posts are needed to reach a desired final grade.
 * Each extra post adds 3 points to the Discussion Board numerator.
 *
 * @param {Object} categoryPercentages Object with all category percentages {CE, DB, Assign, GP, Quiz, Race, Gender, OP, Podcast}
 * @param {number} desired_final The target final grade (e.g. 94 for an A)
 * @param {number} db_points_earned The current discussion board points earned
 * @param {number} db_points_total The total possible discussion board points
 * @param {number} assign_pct The current Assign% (fixed)
 * @param {Object} otherCategories Object with other category percentages for recalculation
 * @returns {number} The number of extra credit posts needed
 */
function extraCreditNeeded(desired_final, db_pct, assign_pct, ce_pct, gp_combined, quiz_pct, ap_combined, op_pct) {
  const db_points_total = section_point_table["Discussion Board Posts"];

  // Convert current db_pct to points
  let db_points_earned = (db_pct / 100) * db_points_total;

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // We'll try increments of extra posts until we reach the desired final grade
  for (let x = 0; x <= 200; x++) {
    const new_db_points = db_points_earned + (3 * x);
    const new_db_pct = (new_db_points / db_points_total) * 100;
    const new_db_assign = (new_db_pct + assign_pct) / 2;

    // Recalculate final grade with updated DB & Assign
    // Final grade = Σ(weights[category]*category_pct) because totalWeight = 1
    // categories: CE, DB&Assign, GP, Quiz, AP, OP
    const new_final = 
      (ce_pct * weights["Class Engagement"]) +
      (new_db_assign * weights["Discussion Board Posts and In-Class Assignments"]) +
      (gp_combined * weights["Group Projects"]) +
      (quiz_pct * weights["Quiz"]) +
      (ap_combined * weights["Assessment Prompts"]) +
      (op_pct * weights["Oral Presentation"]);

    // Since weights sum to 1, new_final is already the final grade percentage
    if (new_final >= desired_final) {
      return x;
    }
  }

  // If we reach here, even 200 posts isn't enough
  return Infinity;
}

document.getElementById('gradeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const ce_num = parseFloat(document.getElementById("ce_numerator").value);
  const ce_den = parseFloat(document.getElementById("ce_denominator").value);

  const db_num = parseFloat(document.getElementById("db_numerator").value);
  const db_den = parseFloat(document.getElementById("db_denominator").value);

  const assign_num = parseFloat(document.getElementById("assign_numerator").value);
  const assign_den = parseFloat(document.getElementById("assign_denominator").value);

  const podcast_num = parseFloat(document.getElementById("podcast_numerator").value);
  const podcast_den = parseFloat(document.getElementById("podcast_denominator").value);

  const gp_num = parseFloat(document.getElementById("gp_numerator").value);
  const gp_den = parseFloat(document.getElementById("gp_denominator").value);

  const quiz_num = parseFloat(document.getElementById("quiz_numerator").value);
  const quiz_den = parseFloat(document.getElementById("quiz_denominator").value);

  const race_num = parseFloat(document.getElementById("race_numerator").value);
  const race_den = parseFloat(document.getElementById("race_denominator").value);

  const gender_num = parseFloat(document.getElementById("gender_numerator").value);
  const gender_den = parseFloat(document.getElementById("gender_denominator").value);

  const op_num = parseFloat(document.getElementById("op_numerator").value);
  const op_den = parseFloat(document.getElementById("op_denominator").value);

  const desired_grade = document.getElementById("desired_grade").value.trim().toUpperCase();

  // Compute percentages
  const ce_pct = calculatePercentage(ce_num, ce_den);

  const db_pct = calculatePercentage(db_num, db_den);
  const assign_pct = calculatePercentage(assign_num, assign_den);
  const db_assign_combined = (db_pct + assign_pct) / 2;

  const podcast_pct = calculatePercentage(podcast_num, podcast_den);
  const gp_pct = calculatePercentage(gp_num, gp_den);
  const gp_combined = (podcast_pct + gp_pct) / 2;

  const quiz_pct = calculatePercentage(quiz_num, quiz_den);

  const race_pct = calculatePercentage(race_num, race_den);
  const gender_pct = calculatePercentage(gender_num, gender_den);
  const ap_combined = (race_pct + gender_pct) / 2;

  const op_pct = calculatePercentage(op_num, op_den);

  const grades = {
    "Class Engagement": ce_pct,
    "Discussion Board Posts and In-Class Assignments": db_assign_combined,
    "Group Projects": gp_combined,
    "Quiz": quiz_pct,
    "Assessment Prompts": ap_combined,
    "Oral Presentation": op_pct
  };

  // Calculate weighted score
  let weighted_score = 0;
  let total_weight = 0;
  for (let category in grades) {
    if (weights[category] !== undefined && !isNaN(grades[category])) {
      weighted_score += grades[category] * weights[category];
      total_weight += weights[category];
    }
  }

  const final_grade = (total_weight > 0) ? (weighted_score / total_weight) : 0;

  let resultHTML = `<p>Your current final grade is: ${final_grade.toFixed(2)}%</p>`;

  if (desired_grade in grade_table) {
    const target_range = grade_table[desired_grade];
    const target_percentage = target_range[0]; // use the lower bound of desired grade

    const needed_posts = extraCreditNeeded(
      target_percentage,
      db_pct,
      assign_pct,
      ce_pct,
      gp_combined,
      quiz_pct,
      ap_combined,
      op_pct
    );

    if (needed_posts === Infinity) {
      resultHTML += `<p>Even 200 extra posts can't reach a ${desired_grade}.</p>`;
    } else if (needed_posts === 0) {
      resultHTML += `<p>You already meet the requirements for a grade of ${desired_grade}. Keep up the good work!</p>`;
    } else {
      resultHTML += `<p>To achieve a grade of ${desired_grade}, you need at least ${needed_posts} extra credit discussion posts.</p>`;
    }
  } else {
    resultHTML += `<p>Invalid grade entered. Please use one of: A, AB, B, BC, C, CD, D, F.</p>`;
  }

  document.getElementById('results').innerHTML = resultHTML;
});
