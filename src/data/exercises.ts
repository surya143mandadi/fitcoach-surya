import type { Exercise } from '../types'

// Demonstration videos: drop royalty-free clips into `videoUrl`.
// Left blank by default so the UI shows a clean "demo video" placeholder area.
export const EXERCISES: Record<string, Exercise> = {
  // ---------------- EASIER ALTERNATIVES / BASICS ----------------
  pushup: {
    id: 'pushup', name: 'Push-Up', primary: ['Chest'], secondary: ['Triceps', 'Shoulders', 'Core'],
    equipment: 'Bodyweight',
    setup: ['Hands slightly wider than shoulders, under the chest.', 'Body in a straight line from head to heels.', 'Brace core, squeeze glutes, tuck elbows ~45 degrees.'],
    steps: ['Lower your chest toward the floor under control.', 'Stop when chest is a fist-height off the ground.', 'Press through the palms back to the top.', 'Keep hips level the whole time.'],
    breathing: 'Inhale as you lower, exhale as you press up.',
    mistakes: ['Sagging or piking hips.', 'Flaring elbows straight out to 90 degrees.', 'Only doing half the range of motion.'],
    safety: ['Drop to knees if form breaks down.', 'Stop if you feel sharp shoulder or wrist pain.'],
    easierAltId: 'incline_pushup', tags: ['push']
  },
  incline_pushup: {
    id: 'incline_pushup', name: 'Incline Push-Up (hands on bench)', primary: ['Chest'], secondary: ['Triceps', 'Shoulders'],
    equipment: 'Bench / bar',
    setup: ['Place hands on a sturdy bench or Smith bar at hip height.', 'Walk feet back to a straight-line plank.', 'Higher the surface = easier.'],
    steps: ['Lower chest to the bench edge.', 'Press back up, keeping body rigid.'],
    breathing: 'Inhale down, exhale up.',
    mistakes: ['Dropping hips.', 'Bar/bench not secure.'],
    safety: ['Make sure the surface cannot slide.'], tags: ['push', 'beginner']
  },
  machine_chest_press: {
    id: 'machine_chest_press', name: 'Machine Chest Press', primary: ['Chest'], secondary: ['Triceps', 'Shoulders'],
    equipment: 'Machine',
    setup: ['Set seat so handles are at mid-chest height.', 'Back and head against the pad, feet flat.'],
    steps: ['Press handles forward until arms are nearly straight (soft elbows).', 'Return slowly until you feel a stretch across the chest.'],
    breathing: 'Exhale pressing out, inhale returning.',
    mistakes: ['Locking elbows hard.', 'Letting the weight slam back.'],
    safety: ['Choose a weight you control for all reps.'], tags: ['push', 'beginner']
  },
  goblet_squat: {
    id: 'goblet_squat', name: 'Goblet Squat', primary: ['Quads', 'Glutes'], secondary: ['Core', 'Hamstrings'],
    equipment: 'Dumbbell / Kettlebell',
    setup: ['Hold one dumbbell vertically against your chest.', 'Feet shoulder-width, toes slightly out.', 'Chest tall, core braced.'],
    steps: ['Sit hips down and back between your knees.', 'Go as deep as you can with a flat back.', 'Drive through mid-foot to stand.', 'Keep elbows inside your knees at the bottom.'],
    breathing: 'Inhale and brace at the top, exhale as you stand.',
    mistakes: ['Heels lifting off the floor.', 'Rounding the lower back.', 'Knees caving inward.'],
    safety: ['Keep the weight light while learning depth.'],
    easierAltId: 'bodyweight_squat', tags: ['legs', 'beginner']
  },
  bodyweight_squat: {
    id: 'bodyweight_squat', name: 'Bodyweight Squat', primary: ['Quads', 'Glutes'], secondary: ['Core'],
    equipment: 'Bodyweight',
    setup: ['Feet shoulder-width, arms out front for balance.'],
    steps: ['Sit down and back, keep chest up.', 'Stand tall, squeeze glutes.'],
    breathing: 'Inhale down, exhale up.',
    mistakes: ['Rounding back.', 'Knees caving in.'],
    safety: ['Use a chair behind you as a depth guide if unsure.'], tags: ['legs', 'beginner']
  },
  db_rdl: {
    id: 'db_rdl', name: 'Dumbbell Romanian Deadlift', primary: ['Hamstrings', 'Glutes'], secondary: ['Back', 'Core'],
    equipment: 'Dumbbells',
    setup: ['Hold a dumbbell in each hand in front of your thighs.', 'Feet hip-width, soft knees, shoulders back.'],
    steps: ['Push hips straight back, dumbbells sliding down your thighs.', 'Lower until you feel a hamstring stretch (usually shin height).', 'Drive hips forward to stand tall.'],
    breathing: 'Inhale as you hinge down, exhale as you stand.',
    mistakes: ['Rounding the back.', 'Squatting instead of hinging.', 'Weights drifting away from the legs.'],
    safety: ['Keep the dumbbells close to your body.', 'Stop before the point your back wants to round.'], tags: ['hinge', 'beginner']
  },
  band_row: {
    id: 'band_row', name: 'Resistance Band Row', primary: ['Back'], secondary: ['Biceps'],
    equipment: 'Band',
    setup: ['Anchor a band at chest height, hold both ends, arms straight.'],
    steps: ['Pull elbows back, squeezing shoulder blades together.', 'Return slowly to the stretch.'],
    breathing: 'Exhale pulling, inhale returning.',
    mistakes: ['Shrugging shoulders up.', 'Using momentum.'],
    safety: ['Check the band and anchor for wear before use.'], tags: ['pull', 'beginner']
  },
  assisted_pullup: {
    id: 'assisted_pullup', name: 'Assisted Pull-Up / Lat Pulldown', primary: ['Back'], secondary: ['Biceps'],
    equipment: 'Machine / Band',
    setup: ['Use the assisted pull-up machine or a lat pulldown.', 'Grip slightly wider than shoulders.'],
    steps: ['Pull your chest toward the bar, elbows down and back.', 'Control the return to a full stretch.'],
    breathing: 'Exhale pulling, inhale returning.',
    mistakes: ['Using too much leg kick.', 'Not reaching full stretch.'],
    safety: ['Set assistance so you can do all reps with control.'], tags: ['pull', 'beginner']
  },
  seated_shoulder_machine: {
    id: 'seated_shoulder_machine', name: 'Seated Machine Shoulder Press', primary: ['Shoulders'], secondary: ['Triceps'],
    equipment: 'Machine',
    setup: ['Adjust seat so handles start at shoulder height.', 'Back against the pad.'],
    steps: ['Press up until arms are nearly straight.', 'Lower under control to shoulder height.'],
    breathing: 'Exhale pressing up, inhale down.',
    mistakes: ['Arching the lower back.', 'Locking elbows hard.'],
    safety: ['Keep ribs down and core braced.'], tags: ['push', 'beginner']
  },
  static_split_squat: {
    id: 'static_split_squat', name: 'Static Split Squat', primary: ['Quads', 'Glutes'], secondary: ['Core'],
    equipment: 'Bodyweight / Dumbbells',
    setup: ['Stagger stance, one foot forward, one back.', 'Hold a rail for balance if needed.'],
    steps: ['Lower the back knee toward the floor.', 'Drive up through the front heel.', 'Complete all reps, then switch sides.'],
    breathing: 'Inhale down, exhale up.',
    mistakes: ['Front knee caving in.', 'Leaning too far forward.'],
    safety: ['Hold support for balance while learning.'], tags: ['legs', 'beginner']
  },
  lying_leg_raise: {
    id: 'lying_leg_raise', name: 'Lying Leg Raise', primary: ['Core'], secondary: [],
    equipment: 'Bodyweight',
    setup: ['Lie on your back, hands under your lower back/glutes.', 'Legs straight.'],
    steps: ['Raise legs to vertical without arching the back.', 'Lower slowly, stop before your back lifts off.'],
    breathing: 'Exhale raising, inhale lowering.',
    mistakes: ['Lower back arching off the floor.', 'Using momentum.'],
    safety: ['Bend knees to make it easier.'], tags: ['core', 'beginner']
  },
  hip_hinge_drill: {
    id: 'hip_hinge_drill', name: 'Bodyweight Hip Hinge', primary: ['Hamstrings', 'Glutes'], secondary: ['Core'],
    equipment: 'Bodyweight / Dowel',
    setup: ['Hold a stick along your back touching head, upper back, and tailbone.'],
    steps: ['Push hips back keeping all three contact points.', 'Return to standing by squeezing glutes.'],
    breathing: 'Inhale hinging, exhale standing.',
    mistakes: ['Losing the stick contact (rounding).'],
    safety: ['Great warm-up drill before deadlifts.'], tags: ['hinge', 'beginner']
  },

  // ---------------- THURSDAY: UPPER BODY ----------------
  barbell_bench: {
    id: 'barbell_bench', name: 'Barbell Bench Press', primary: ['Chest'], secondary: ['Triceps', 'Shoulders'],
    equipment: 'Barbell + Bench',
    setup: ['Lie back with eyes under the bar.', 'Grip slightly wider than shoulders.', 'Plant feet, squeeze shoulder blades down and back, slight arch.'],
    steps: ['Unrack and hold the bar over your chest.', 'Lower the bar to your lower-chest/nipple line, elbows ~45 degrees.', 'Touch lightly, then press up and slightly back over the shoulders.', 'Keep wrists stacked over elbows.'],
    breathing: 'Big breath and brace at the top, inhale as you lower, exhale as you press.',
    mistakes: ['Bouncing the bar off the chest.', 'Flaring elbows to 90 degrees.', 'Lifting hips off the bench.'],
    safety: ['Use a spotter or safety pins for working sets.', 'Train in a rack with safeties if alone.'],
    easierAltId: 'machine_chest_press', tags: ['push']
  },
  incline_db_press: {
    id: 'incline_db_press', name: 'Incline Dumbbell Press', primary: ['Chest'], secondary: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells + Incline Bench',
    setup: ['Set bench to 30 degrees.', 'Start dumbbells at the top of your thighs, kick them up as you lie back.'],
    steps: ['Press dumbbells up over your upper chest.', 'Lower to the sides of your chest with a stretch.', 'Keep a slight arc, elbows ~45 degrees.'],
    breathing: 'Inhale lowering, exhale pressing.',
    mistakes: ['Setting the bench too steep (turns into shoulders).', 'Clashing dumbbells at the top.'],
    safety: ['Control the dumbbells on the last rep; sit up to set them down.'],
    easierAltId: 'machine_chest_press', tags: ['push']
  },
  lat_pulldown: {
    id: 'lat_pulldown', name: 'Lat Pulldown', primary: ['Back'], secondary: ['Biceps'],
    equipment: 'Cable machine',
    setup: ['Set thigh pad snug.', 'Grip wider than shoulders, palms forward.', 'Chest up, slight lean back.'],
    steps: ['Pull the bar to your upper chest, driving elbows down and back.', 'Squeeze your lats at the bottom.', 'Return with control to a full overhead stretch.'],
    breathing: 'Exhale pulling down, inhale returning up.',
    mistakes: ['Yanking with body swing.', 'Pulling behind the neck.', 'Not fully stretching at the top.'],
    safety: ['Keep the motion smooth, no jerking.'],
    easierAltId: 'assisted_pullup', tags: ['pull']
  },
  seated_cable_row: {
    id: 'seated_cable_row', name: 'Seated Cable Row', primary: ['Back'], secondary: ['Biceps', 'Shoulders'],
    equipment: 'Cable machine',
    setup: ['Feet on the platform, soft knees.', 'Sit tall, chest up, slight forward lean to start.'],
    steps: ['Pull the handle to your belly button, elbows close.', 'Squeeze shoulder blades together.', 'Extend arms forward for a full stretch, keep back flat.'],
    breathing: 'Exhale pulling in, inhale returning.',
    mistakes: ['Heaving with the lower back.', 'Shrugging shoulders to ears.'],
    safety: ['Move from the arms and back, not by rocking the torso.'],
    easierAltId: 'band_row', tags: ['pull']
  },
  db_shoulder_press: {
    id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', primary: ['Shoulders'], secondary: ['Triceps'],
    equipment: 'Dumbbells + Bench',
    setup: ['Sit on an upright bench, dumbbells at shoulder height, palms forward.', 'Feet flat, core braced, ribs down.'],
    steps: ['Press dumbbells overhead until arms are nearly straight.', 'Lower under control to ear height.'],
    breathing: 'Exhale pressing up, inhale lowering.',
    mistakes: ['Overarching the lower back.', 'Clashing dumbbells overhead.'],
    safety: ['Keep core tight to protect the lower back.'],
    easierAltId: 'seated_shoulder_machine', tags: ['push']
  },
  db_lateral_raise: {
    id: 'db_lateral_raise', name: 'Dumbbell Lateral Raise', primary: ['Shoulders'], secondary: [],
    equipment: 'Dumbbells',
    setup: ['Stand tall, light dumbbells at your sides, slight elbow bend.'],
    steps: ['Raise arms out to the sides to shoulder height.', 'Lead with the elbows, pinkies slightly up.', 'Lower slowly.'],
    breathing: 'Exhale raising, inhale lowering.',
    mistakes: ['Using too heavy a weight and swinging.', 'Shrugging the traps.'],
    safety: ['Keep it light and controlled, this is an isolation move.'], tags: ['push']
  },
  triceps_pushdown: {
    id: 'triceps_pushdown', name: 'Triceps Rope Pushdown', primary: ['Triceps'], secondary: [],
    equipment: 'Cable + Rope',
    setup: ['Rope on high pulley, elbows pinned to your sides.', 'Slight forward lean, core braced.'],
    steps: ['Push the rope down and split the ends at the bottom.', 'Fully straighten the elbows.', 'Control the rope back up to ~90 degrees.'],
    breathing: 'Exhale pushing down, inhale returning.',
    mistakes: ['Elbows drifting forward.', 'Using the shoulders/body to push.'],
    safety: ['Keep elbows still, only the forearms move.'], tags: ['push']
  },
  db_biceps_curl: {
    id: 'db_biceps_curl', name: 'Dumbbell Biceps Curl', primary: ['Biceps'], secondary: ['Forearms'],
    equipment: 'Dumbbells',
    setup: ['Stand tall, dumbbells at your sides, palms forward.', 'Elbows pinned to your ribs.'],
    steps: ['Curl the weights up by bending the elbows.', 'Squeeze at the top.', 'Lower slowly to a full stretch.'],
    breathing: 'Exhale curling up, inhale lowering.',
    mistakes: ['Swinging the torso.', 'Elbows drifting forward.'],
    safety: ['No body english, let the biceps do the work.'], tags: ['pull']
  },

  // ---------------- FRIDAY: LOWER BODY + CORE ----------------
  back_squat: {
    id: 'back_squat', name: 'Barbell Back Squat', primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'],
    equipment: 'Barbell + Rack',
    setup: ['Bar on your upper traps/rear delts, not your neck.', 'Feet shoulder-width, toes slightly out.', 'Brace core hard, chest up.'],
    steps: ['Unrack, take 2-3 steps back.', 'Break at hips and knees together, sit down and back.', 'Descend to at least thighs parallel with a flat back.', 'Drive through mid-foot to stand.'],
    breathing: 'Big breath at the top, hold and brace on the way down, exhale near the top.',
    mistakes: ['Knees caving in.', 'Heels lifting / weight on toes.', 'Rounding the lower back at the bottom.'],
    safety: ['Always set the rack safety pins at the correct height.', 'Squat inside a rack when training alone.'],
    easierAltId: 'goblet_squat', tags: ['legs']
  },
  romanian_deadlift: {
    id: 'romanian_deadlift', name: 'Romanian Deadlift (RDL)', primary: ['Hamstrings', 'Glutes'], secondary: ['Back', 'Core'],
    equipment: 'Barbell',
    setup: ['Hold the bar at hip level, hands just outside your thighs.', 'Feet hip-width, soft knees, shoulders pulled back.', 'Brace your core and keep a flat back.'],
    steps: ['Push your hips straight back, letting the bar slide down your thighs.', 'Keep the bar in contact with your legs the whole way.', 'Lower until you feel a strong hamstring stretch (usually just below the knees).', 'Drive your hips forward and squeeze your glutes to stand tall.', 'Keep knees only slightly bent and fixed throughout.'],
    breathing: 'Inhale and brace at the top, hold as you hinge down, exhale as you finish standing.',
    mistakes: ['Rounding the lower back (a bent back is the #1 error).', 'Turning it into a squat by bending the knees too much.', 'Letting the bar drift away from the legs.', 'Going too low and losing the flat-back position.'],
    safety: ['Stop lowering the moment your back wants to round.', 'Start light to groove the hip hinge.', 'Keep the bar close to your body at all times.'],
    easierAltId: 'db_rdl', tags: ['hinge']
  },
  leg_press: {
    id: 'leg_press', name: 'Leg Press', primary: ['Quads', 'Glutes'], secondary: ['Hamstrings'],
    equipment: 'Machine',
    setup: ['Feet shoulder-width on the platform, mid-height.', 'Back and hips flat against the pad.'],
    steps: ['Release the safeties and lower the platform until knees reach ~90 degrees.', 'Keep your lower back on the pad.', 'Press back up without locking the knees hard.'],
    breathing: 'Inhale lowering, exhale pressing.',
    mistakes: ['Letting the lower back round off the pad (going too deep).', 'Locking knees explosively.', 'Knees caving in.'],
    safety: ['Never fully lock and bounce the knees.', 'Re-engage the safety catches when finished.'],
    easierAltId: 'goblet_squat', tags: ['legs']
  },
  walking_lunge: {
    id: 'walking_lunge', name: 'Walking Lunge', primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'],
    equipment: 'Dumbbells / Bodyweight',
    setup: ['Stand tall holding dumbbells at your sides (or bodyweight).', 'Core braced, chest up.'],
    steps: ['Step forward and lower until both knees are ~90 degrees.', 'Drive through the front heel to bring the back leg through.', 'Continue stepping forward, alternating legs.'],
    breathing: 'Inhale as you step down, exhale as you drive up.',
    mistakes: ['Front knee caving inward.', 'Torso pitching too far forward.', 'Short choppy steps.'],
    safety: ['Do them in an open space; use the static version if balance is an issue.'],
    easierAltId: 'static_split_squat', tags: ['legs']
  },
  leg_curl: {
    id: 'leg_curl', name: 'Seated / Lying Leg Curl', primary: ['Hamstrings'], secondary: ['Calves'],
    equipment: 'Machine',
    setup: ['Adjust the pad to sit just above your heels/Achilles.', 'Align knees with the machine pivot.'],
    steps: ['Curl your heels toward your glutes.', 'Squeeze the hamstrings at the end.', 'Lower slowly to a stretch.'],
    breathing: 'Exhale curling, inhale returning.',
    mistakes: ['Lifting the hips off the pad.', 'Using momentum to fling the weight.'],
    safety: ['Control the eccentric, hamstrings respond well to slow lowering.'], tags: ['legs']
  },
  standing_calf_raise: {
    id: 'standing_calf_raise', name: 'Standing Calf Raise', primary: ['Calves'], secondary: [],
    equipment: 'Machine / Dumbbells',
    setup: ['Balls of the feet on the platform edge, heels hanging.', 'Stand tall, core braced.'],
    steps: ['Rise up onto your toes as high as possible.', 'Pause and squeeze at the top.', 'Lower slowly for a deep stretch.'],
    breathing: 'Exhale raising, inhale lowering.',
    mistakes: ['Bouncing at the bottom.', 'Short range of motion.'],
    safety: ['Hold a rail for balance if needed.'], tags: ['legs']
  },
  plank: {
    id: 'plank', name: 'Plank', primary: ['Core'], secondary: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    setup: ['Forearms on the floor, elbows under shoulders.', 'Body in a straight line, toes on the ground.'],
    steps: ['Brace your abs and squeeze your glutes.', 'Hold the straight-line position for the prescribed time.', 'Keep breathing steadily.'],
    breathing: 'Breathe normally and steadily, do not hold your breath.',
    mistakes: ['Hips sagging or piking up.', 'Head dropping down.', 'Holding your breath.'],
    safety: ['Stop the set if the lower back starts to ache, reset your brace.'], tags: ['core']
  },
  hanging_leg_raise: {
    id: 'hanging_leg_raise', name: 'Hanging Leg Raise', primary: ['Core'], secondary: ['Forearms'],
    equipment: 'Pull-up bar',
    setup: ['Hang from a bar, shoulders slightly engaged (not fully relaxed).'],
    steps: ['Raise your legs (straight or knees bent) toward your chest.', 'Curl the pelvis up slightly at the top.', 'Lower slowly, resisting the swing.'],
    breathing: 'Exhale raising, inhale lowering.',
    mistakes: ['Swinging with momentum.', 'Only using hip flexors (no pelvic curl).'],
    safety: ['Use straps if grip fails before the abs do.'],
    easierAltId: 'lying_leg_raise', tags: ['core']
  },
  cable_woodchop: {
    id: 'cable_woodchop', name: 'Cable Woodchop', primary: ['Core'], secondary: ['Shoulders'],
    equipment: 'Cable machine',
    setup: ['Set pulley high, stand side-on, arms extended toward the pulley.', 'Feet shoulder-width, core braced.'],
    steps: ['Pull the handle down and across to the opposite hip.', 'Rotate through the torso, pivot the back foot.', 'Return slowly. Complete reps, then switch sides.'],
    breathing: 'Exhale on the chop, inhale on the return.',
    mistakes: ['Using only the arms.', 'Rounding the back.'],
    safety: ['Rotate from the mid-back, keep the core braced.'], tags: ['core']
  },

  // ---------------- SATURDAY: FULL BODY ----------------
  deadlift: {
    id: 'deadlift', name: 'Conventional Deadlift', primary: ['Back', 'Glutes', 'Hamstrings'], secondary: ['Core', 'Forearms', 'Quads'],
    equipment: 'Barbell',
    setup: ['Bar over mid-foot, shins ~an inch from the bar.', 'Hinge and grip just outside the knees.', 'Chest up, flat back, shoulders slightly ahead of the bar, brace hard.'],
    steps: ['Take the slack out of the bar (big breath, engage lats).', 'Push the floor away, keeping the bar dragging up your legs.', 'Once past the knees, drive hips forward to stand tall.', 'Reverse the path to lower under control.'],
    breathing: 'Big breath and brace before the pull, hold through the rep, exhale at the top.',
    mistakes: ['Rounding the lower back.', 'Hips shooting up first (turning it into a stiff-leg pull).', 'Bar drifting away from the body.'],
    safety: ['Never round the back under load.', 'Reset your brace before every rep, no bouncing off the floor.'],
    easierAltId: 'db_rdl', tags: ['hinge']
  },
  db_bench: {
    id: 'db_bench', name: 'Flat Dumbbell Bench Press', primary: ['Chest'], secondary: ['Triceps', 'Shoulders'],
    equipment: 'Dumbbells + Bench',
    setup: ['Lie flat, dumbbells at chest, palms forward.', 'Shoulder blades pinched down, feet planted.'],
    steps: ['Press the dumbbells up over your chest.', 'Lower to the sides of the chest with a stretch.', 'Press back up, elbows ~45 degrees.'],
    breathing: 'Inhale lowering, exhale pressing.',
    mistakes: ['Flaring elbows to 90 degrees.', 'Clashing dumbbells at the top.'],
    safety: ['Control the dumbbells on the last rep and sit up to set them down.'],
    easierAltId: 'machine_chest_press', tags: ['push']
  },
  one_arm_db_row: {
    id: 'one_arm_db_row', name: 'One-Arm Dumbbell Row', primary: ['Back'], secondary: ['Biceps'],
    equipment: 'Dumbbell + Bench',
    setup: ['One knee and hand on the bench, back flat and parallel to the floor.', 'Dumbbell hanging in the free hand.'],
    steps: ['Row the dumbbell to your hip, driving the elbow up and back.', 'Squeeze the shoulder blade.', 'Lower to a full stretch.'],
    breathing: 'Exhale rowing up, inhale lowering.',
    mistakes: ['Twisting the torso to heave the weight.', 'Shrugging.'],
    safety: ['Keep the back flat, do not round to reach lower.'],
    easierAltId: 'band_row', tags: ['pull']
  },
  overhead_press: {
    id: 'overhead_press', name: 'Standing Overhead Press', primary: ['Shoulders'], secondary: ['Triceps', 'Core'],
    equipment: 'Barbell / Dumbbells',
    setup: ['Bar at collarbone height, hands just outside shoulders.', 'Feet hip-width, glutes and core braced, ribs down.'],
    steps: ['Press the bar straight up, moving your head back slightly out of the way.', 'Lock out overhead with the bar over mid-foot.', 'Lower under control to the collarbone.'],
    breathing: 'Breath and brace at the bottom, exhale near lockout.',
    mistakes: ['Overarching the lower back (leaning back).', 'Pressing the bar forward instead of up.'],
    safety: ['Keep glutes and abs tight to protect the lower back.'],
    easierAltId: 'seated_shoulder_machine', tags: ['push']
  },
  kb_swing: {
    id: 'kb_swing', name: 'Kettlebell Swing', primary: ['Glutes', 'Hamstrings'], secondary: ['Core', 'Back', 'Shoulders'],
    equipment: 'Kettlebell',
    setup: ['Kettlebell ~1 foot in front, hinge and grip it.', 'Flat back, shoulders packed, chest up.'],
    steps: ['Hike the bell back between your legs.', 'Snap your hips forward explosively to float the bell to chest height.', 'Let it fall, absorb by hinging, repeat.', 'The power comes from the hips, not the arms.'],
    breathing: 'Sharp exhale on the hip snap, inhale on the backswing.',
    mistakes: ['Squatting the swing instead of hinging.', 'Lifting with the arms/shoulders.', 'Rounding the back.'],
    safety: ['Master the hip hinge first.', 'Keep the back flat throughout.'],
    easierAltId: 'hip_hinge_drill', tags: ['hinge']
  }
}

export const EXERCISE_LIST: Exercise[] = Object.values(EXERCISES)
export function getExercise(id: string): Exercise | undefined { return EXERCISES[id] }
