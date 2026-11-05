import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Award, BookOpen, CheckCircle2, 
  XCircle, ChevronRight, ArrowLeft, Trophy, Sparkles, 
  ExternalLink, RotateCcw, Flame, Star, ShieldCheck
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { ACADEMY_COURSES, AcademyCourse, QuizQuestion } from '../../data/legalAcademyData';

export const LegalAcademyView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'courses' | 'leaderboard'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/academy/leaderboard')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.leaderboard) setLeaderboard(d.leaderboard);
      })
      .catch(() => {});
  }, []);

  const handleStartQuiz = (course: AcademyCourse) => {
    haptic('medium');
    setSelectedCourse(course);
    setQuizMode(true);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !selectedCourse) return;
    haptic('medium');
    setIsAnswerSubmitted(true);

    const question = selectedCourse.questions[currentQuestionIdx];
    if (selectedOption === question.correctIndex) {
      haptic('success');
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      haptic('error');
    }
  };

  const handleNextQuestion = () => {
    if (!selectedCourse) return;
    haptic('light');
    if (currentQuestionIdx + 1 < selectedCourse.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setQuizFinished(true);
      submitQuizResults();
    }
  };

  const submitQuizResults = async () => {
    if (!selectedCourse) return;
    const total = selectedCourse.questions.length;
    const score = Math.round((correctAnswersCount / total) * 100);
    try {
      await fetch('/api/academy/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id ? String(user.id) : 'default_user',
          category: selectedCourse.category,
          score,
          total: 100
        })
      });
    } catch (e) {}
  };

  const currentQ: QuizQuestion | undefined = selectedCourse?.questions[currentQuestionIdx];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {language === 'ru' ? 'Юридическая Академия' : 'Huquqiy Akademiya'}
              </h2>
              <p className="text-xs text-slate-400">
                O'zbekiston qonunlari bo'yicha professional ta'lim va interaktiv testlar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>XP Reyting</span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              haptic('light');
              setActiveTab('courses');
              setQuizMode(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'courses' && !quizMode
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : isDark
                ? 'bg-slate-800 text-slate-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Kurslar va Darslar
          </button>

          <button
            onClick={() => {
              haptic('light');
              setActiveTab('leaderboard');
              setQuizMode(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : isDark
                ? 'bg-slate-800 text-slate-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Peshqadamlar</span>
          </button>
        </div>
      </div>

      {/* QUIZ MODE ACTIVE */}
      {quizMode && selectedCourse && currentQ && !quizFinished && (
        <div className={`p-5 rounded-3xl border shadow-xl ${
          isDark ? 'bg-[#0a1128] border-indigo-900/60 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <button
              onClick={() => setQuizMode(false)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
            <span className="text-xs font-extrabold text-amber-400">
              Savol {currentQuestionIdx + 1} / {selectedCourse.questions.length}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold mt-4 mb-4 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800';

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnClass = 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-600/30 border-rose-500 text-rose-300 font-bold';
                }
              } else if (isSelected) {
                btnClass = 'bg-amber-500/30 border-amber-400 text-amber-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    haptic('light');
                    setSelectedOption(idx);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Rationale explanation card after submitting */}
          {isAnswerSubmitted && (
            <div className={`mt-4 p-4 rounded-2xl border ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Qonuniy asos va izoh:</span>
              </div>
              <p className="text-xs leading-relaxed">{currentQ.explanation}</p>
              <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-amber-400">{currentQ.legalBasis}</span>
                <a
                  href={currentQ.lexUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-amber-300 hover:underline font-bold"
                >
                  <span>Lex.uz da tekshirish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="mt-5 flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs disabled:opacity-40 shadow-md cursor-pointer"
              >
                Javobni tasdiqlash
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentQuestionIdx + 1 < selectedCourse.questions.length ? "Keyingi savol" : "Natijani ko'rish"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ FINISHED CARD */}
      {quizFinished && selectedCourse && (
        <div className={`p-6 rounded-3xl border text-center shadow-xl ${
          isDark ? 'bg-[#0a1128] border-indigo-900 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black">Test Muvaffaqiyatli Yakunlandi!</h3>
          <p className="text-xs text-slate-400 mt-1">{selectedCourse.title}</p>

          <div className="my-4 py-3 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 inline-block">
            <span className="text-3xl font-black text-amber-400">
              {correctAnswersCount} / {selectedCourse.questions.length}
            </span>
            <p className="text-[11px] font-bold text-slate-300 mt-0.5">
              To'g'ri javoblar (+{correctAnswersCount * 10} XP)
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleStartQuiz(selectedCourse)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Qaytadan yechish</span>
            </button>
            <button
              onClick={() => {
                setQuizMode(false);
                setActiveTab('leaderboard');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md"
            >
              Reytingni ko'rish
            </button>
          </div>
        </div>
      )}

      {/* COURSES LIST */}
      {activeTab === 'courses' && !quizMode && (
        <div className="space-y-3">
          {ACADEMY_COURSES.map((course) => (
            <div
              key={course.id}
              className={`p-4 rounded-3xl border transition ${
                isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      {course.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {course.durationMinutes} daqiqa
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Key articles tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {course.keyArticles.map((art, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800/80 text-amber-300 border border-slate-700"
                  >
                    {art}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {course.questions.length} ta interaktiv kazus testi
                </span>
                <button
                  onClick={() => handleStartQuiz(course)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>Testni boshlash</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LEADERBOARD VIEW */}
      {activeTab === 'leaderboard' && !quizMode && (
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#0a1128] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Eng Yaxshi Huquqshunoslar Reytingi</span>
          </h3>

          <div className="space-y-2.5">
            {leaderboard.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Hozircha reyting ma'lumotlari mavjud emas.</p>
            ) : (
              leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    idx === 0
                      ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                      : isDark
                      ? 'bg-slate-800/60 border-slate-700 text-slate-200'
                      : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-700 text-slate-300'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold">{item.user_name}</p>
                      <p className="text-[10px] text-slate-400">{item.rank_title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400">{item.xp} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
