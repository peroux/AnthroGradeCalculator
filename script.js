// Replicate the logic in JavaScript

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
    "Discussion Board Posts": 260,
    "In-Class Assignments": 200,
    "Group Projects": 100,
    "Quiz": 100,
    "Assessment Prompts": 150,
    "Oral Presentation": 100,
    "Race Assessment": 50,
    "Gender Assessment": 50,
    "Podcast": 170
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
  
  // Given numerator/denominator, return percentage
  function calculatePercentage(numerator, denominator) {
    if (denominator === 0 || isNaN(denominator)) return 0;
    return (numerator / denominator) * 100;
  }
  
  // If using class totals, denominator is taken from section_point_table. Otherwise, user provides it.
  function getPercentageInput(numerator, userDenominator, defaultDenominator) {
    let denominator = defaultDenominator || userDenominator;
    return calculatePercentage(numerator, denominator);
  }
  
  // Calculate extra credit needed for Discussion Board (3 pts per post)
  function extraCreditNeeded(current_db_percentage, target_percentage) {
    const total_points_possible = section_point_table["Discussion Board Posts"];
    const current_points = (current_db_percentage / 100) * total_points_possible;
    const needed_points = (target_percentage / 100) * total_points_possible;
    if (current_points >= needed_points) {
      return 0;
    } else {
      const extra_needed = (needed_points - current_points) / 3;
      return Math.max(0, Math.ceil(extra_needed));
    }
  }
  
  document.getElementById('gradeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const useClassTotals = document.getElementById("useClassTotals").value.toLowerCase() === "n";
  
    // Gather inputs
    const ce_num = parseFloat(document.getElementById("ce_numerator").value);
    const ce_den = useClassTotals ? section_point_table["Class Engagement"] : parseFloat(document.getElementById("ce_denominator").value);
  
    const db_num = parseFloat(document.getElementById("db_numerator").value);
    const db_den = useClassTotals ? section_point_table["Discussion Board Posts"] : parseFloat(document.getElementById("db_denominator").value);
  
    const assign_num = parseFloat(document.getElementById("assign_numerator").value);
    const assign_den = useClassTotals ? section_point_table["In-Class Assignments"] : parseFloat(document.getElementById("assign_denominator").value);
  
    const podcast_num = parseFloat(document.getElementById("podcast_numerator").value);
    // Podcast always requires a denominator. If class totals are not used, user must provide it, else use given table.
    const podcast_den = useClassTotals ? section_point_table["Podcast"] : (parseFloat(document.getElementById("podcast_denominator").value) || 0);
  
    const gp_num = parseFloat(document.getElementById("gp_numerator").value);
    const gp_den = useClassTotals ? section_point_table["Group Projects"] : parseFloat(document.getElementById("gp_denominator").value);
  
    const quiz_num = parseFloat(document.getElementById("quiz_numerator").value);
    const quiz_den = useClassTotals ? section_point_table["Quiz"] : parseFloat(document.getElementById("quiz_denominator").value);
  
    const race_num = parseFloat(document.getElementById("race_numerator").value);
    const race_den = useClassTotals ? section_point_table["Race Assessment"] : (parseFloat(document.getElementById("race_denominator").value) || 0);
  
    const gender_num = parseFloat(document.getElementById("gender_numerator").value);
    const gender_den = useClassTotals ? section_point_table["Gender Assessment"] : (parseFloat(document.getElementById("gender_denominator").value) || 0);
  
    const op_num = parseFloat(document.getElementById("op_numerator").value);
    const op_den = useClassTotals ? section_point_table["Oral Presentation"] : parseFloat(document.getElementById("op_denominator").value);
  
    const desired_grade = document.getElementById("desired_grade").value.trim().toUpperCase();
  
    // Compute percentages
    const ce_pct = getPercentageInput(ce_num, ce_den, ce_den);
  
    const db_pct = getPercentageInput(db_num, db_den, db_den);
    const assign_pct = getPercentageInput(assign_num, assign_den, assign_den);
    const db_assign_combined = (db_pct + assign_pct) / 2;
  
    const podcast_pct = getPercentageInput(podcast_num, podcast_den, podcast_den);
    const gp_pct = getPercentageInput(gp_num, gp_den, gp_den);
    const gp_combined = (podcast_pct + gp_pct) / 2;
  
    const quiz_pct = getPercentageInput(quiz_num, quiz_den, quiz_den);
  
    const race_pct = getPercentageInput(race_num, race_den, race_den);
    const gender_pct = getPercentageInput(gender_num, gender_den, gender_den);
    const ap_combined = (race_pct + gender_pct) / 2;
  
    const op_pct = getPercentageInput(op_num, op_den, op_den);
  
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
      const target_percentage = target_range[0]; // use the lower bound
  
      // Extra credit needed
      const needed_posts = extraCreditNeeded(db_pct, target_percentage);
  
      if (needed_posts === 0) {
        resultHTML += `<p>You already meet the requirements for a grade of ${desired_grade}. Keep up the good work!</p>`;
      } else {
        resultHTML += `<p>To achieve a grade of ${desired_grade}, you need at least ${needed_posts} extra credit discussion posts.</p>`;
      }
    } else {
      resultHTML += `<p>Invalid grade entered. Please use one of: A, AB, B, BC, C, CD, D, F.</p>`;
    }
  
    document.getElementById('results').innerHTML = resultHTML;
  });