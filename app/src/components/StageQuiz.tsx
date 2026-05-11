import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { storage } from '@/lib/storage';
import confetti from 'canvas-confetti';
import { trackActivity } from '@/lib/badges';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface StageQuizProps {
  stageId: string;
  questions: QuizQuestion[];
}

const QUIZ_STORAGE_KEY = 'quiz_results';

export function StageQuiz({ stageId, questions }: StageQuizProps) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const isCorrect = idx === questions[current].correctIndex;
    if (isCorrect) setCorrectCount(c => c + 1);
    setAnswers(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      // Finished
      const score = correctCount + (selected === questions[current].correctIndex ? 1 : 0);
      const total = questions.length;
      const passed = score >= Math.ceil(total * 0.6);
      
      const results = storage.get<Record<string, { score: number; total: number; passed: boolean }>>(QUIZ_STORAGE_KEY, {});
      results[stageId] = { score, total, passed };
      storage.set(QUIZ_STORAGE_KEY, results);
      trackActivity('reference_read'); // generic engagement tracking

      if (passed) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#16a34a', '#22c55e', '#f59e0b'],
        });
      }
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCorrectCount(0);
    setAnswers([]);
  };

  const isFinished = answers.length === questions.length;

  if (isFinished) {
    const score = correctCount;
    const passed = score >= Math.ceil(questions.length * 0.6);
    return (
      <Card className="p-6 mt-8 border-2 border-primary/10">
        <div className="text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {passed ? <Trophy className="h-7 w-7" /> : <RotateCcw className="h-7 w-7" />}
          </div>
          <h3 className="text-lg font-bold mb-1">{passed ? 'Quiz passed!' : 'Keep learning'}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You scored {score} out of {questions.length}
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestart} className="gap-1">
              <RotateCcw className="h-4 w-4" />
              Retry quiz
            </Button>
            {!passed && (
              <Button size="sm" asChild>
                <a href="#top">Review this stage</a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const q = questions[current];

  return (
    <Card className="p-6 mt-8 border-2 border-primary/10">
      {!started ? (
        <div className="text-center">
          <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">Test your knowledge</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {questions.length} quick questions to check what you have learned from this stage.
          </p>
          <Button onClick={() => setStarted(true)} className="gap-1">
            Start quiz
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-xs font-bold text-primary">
              {correctCount}/{current + (showResult ? 1 : 0)} correct
            </span>
          </div>

          <h4 className="font-semibold text-base mb-4">{q.question}</h4>

          <div className="space-y-2 mb-4">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = idx === q.correctIndex;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    showCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : showWrong
                      ? 'bg-red-50 border-red-300 text-red-800'
                      : isSelected
                      ? 'bg-primary/5 border-primary'
                      : 'bg-white border-slate-200 hover:border-primary/30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    showCorrect ? 'bg-emerald-600 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {showCorrect ? <CheckCircle className="h-4 w-4" /> : showWrong ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${selected === q.correctIndex ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
              <p className="font-medium mb-1">{selected === q.correctIndex ? 'Correct!' : 'Not quite.'}</p>
              <p className="text-xs opacity-90">{q.explanation}</p>
            </div>
          )}

          {showResult && (
            <Button onClick={handleNext} className="w-full gap-1">
              {current < questions.length - 1 ? 'Next question' : 'See results'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

