import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const exercises = [
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    description: "Build stronger arms with proper bicep curl form and technique",
    difficulty: "Beginner",
    targetMuscle: "Biceps",
    reps: "12-15",
  },
  {id: "squats",
    name: "squats",
    description: "Build stronger arms with proper bicep curl form and technique",
    difficulty: "Beginner",
    targetMuscle: "Thighs",
    reps: "12-15",},
  // {
  //   id: "triceps-kickback",
  //   name: "Triceps Kickback",
  //   description: "Tone your triceps with controlled kickback movements",
  //   difficulty: "Beginner",
  //   targetMuscle: "Triceps",
  //   reps: "10-12",
  // },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    description: "Develop strong shoulders with overhead pressing motion",
    difficulty: "Intermediate",
    targetMuscle: "Shoulders",
    reps: "8-12",
  },
  // {
  //   id: "lateral-raise",
  //   name: "Lateral Raise",
  //   description: "Sculpt your shoulders with lateral deltoid isolation",
  //   difficulty: "Beginner",
  //   targetMuscle: "Shoulders",
  //   reps: "12-15",
  // },
  // {
  //   id: "front-raise",
  //   name: "Front Raise",
  //   description: "Target the anterior deltoids with controlled front raises",
  //   difficulty: "Beginner",
  //   targetMuscle: "Shoulders",
  //   reps: "10-15",
  // },
  // {
  //   id: "hammer-curl",
  //   name: "Hammer Curl",
  //   description: "Build forearm and bicep strength with neutral grip curls",
  //   difficulty: "Beginner",
  //   targetMuscle: "Biceps & Forearms",
  //   reps: "10-12",
  // },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "intermediate":
      return "bg-accent/10 text-accent border-accent/20";
    case "advanced":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

const ExerciseSelection = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FitFlow
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/exercises" className="text-foreground hover:text-primary transition-colors">
              Exercises
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-primary">Exercise</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Select an exercise to start your workout with AI-powered form tracking
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <Link
              key={exercise.id}
              to={`/exercise/${exercise.id}`}
              className="block animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="group relative bg-gradient-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border hover:border-primary/50 h-full">
                {/* Exercise Icon */}
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Dumbbell className="h-7 w-7 text-primary" />
                </div>

                {/* Exercise Info */}
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {exercise.name}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {exercise.description}
                </p>

                {/* Exercise Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target Muscle</span>
                    <span className="font-medium text-foreground">{exercise.targetMuscle}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recommended Reps</span>
                    <span className="font-medium text-foreground">{exercise.reps}</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {exercise.difficulty}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary transition-colors duration-300"
                  >
                    Start →
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelection;
