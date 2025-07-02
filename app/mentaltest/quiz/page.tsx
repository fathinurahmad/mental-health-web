'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type TestInfo = {
  title: string;
  questions: string[];
  interpretScore: (score: number) => string;
  maxScore: number;
  category: string;
};

const testData: Record<string, TestInfo> = {
  phq9: {
    title: 'PHQ-9 - Skrining Depresi',
    category: 'Depresi',
    maxScore: 27,
    questions: [
      'Kehilangan minat atau kesenangan dalam melakukan sesuatu?',
      'Merasa murung, depresi, atau putus asa?',
      'Kesulitan tidur atau tidur berlebihan?',
      'Merasa lelah atau kekurangan energi?',
      'Nafsu makan menurun atau meningkat?',
      'Merasa buruk tentang diri sendiri — bahwa Anda gagal atau mengecewakan keluarga Anda?',
      'Kesulitan berkonsentrasi, misalnya membaca koran atau menonton TV?',
      'Bergerak atau berbicara sangat lambat atau terlalu gelisah?',
      'Pikiran bahwa lebih baik mati atau menyakiti diri sendiri?',
    ],
    interpretScore: (score) => {
      if (score <= 4) return 'Minimal / Tidak ada depresi';
      if (score <= 9) return 'Depresi ringan';
      if (score <= 14) return 'Depresi sedang';
      if (score <= 19) return 'Depresi sedang berat';
      return 'Depresi berat';
    },
  },
  bdi: {
    title: 'BDI - Beck Depression Inventory',
    category: 'Depresi',
    maxScore: 63,
    questions: [
      'Merasa sedih, murung, atau tidak bahagia?',
      'Merasa pesimis atau putus asa tentang masa depan?',
      'Merasa gagal atau kecewa dengan diri sendiri?',
      'Kehilangan kepuasan atau kesenangan dalam hidup?',
      'Merasa bersalah secara berlebihan?',
      'Merasa dihukum atau akan dihukum?',
      'Merasa kecewa dengan diri sendiri?',
      'Menyalahkan diri sendiri atas hal-hal yang salah?',
      'Memiliki pikiran untuk bunuh diri?',
      'Menangis lebih sering dari biasanya?',
      'Merasa lebih mudah tersinggung atau marah?',
      'Kehilangan minat pada orang lain?',
      'Kesulitan membuat keputusan?',
      'Merasa penampilan Anda memburuk?',
      'Sulit bekerja atau melakukan aktivitas?',
      'Mengalami gangguan tidur?',
      'Merasa lebih cepat lelah?',
      'Kehilangan nafsu makan?',
      'Khawatir tentang kesehatan fisik?',
      'Kehilangan minat pada seks?',
      'Sulit berkonsentrasi?',
    ],
    interpretScore: (score) => {
      if (score <= 13) return 'Depresi minimal';
      if (score <= 19) return 'Depresi ringan';
      if (score <= 28) return 'Depresi sedang';
      return 'Depresi berat';
    },
  },
  epds: {
    title: 'EPDS - Edinburgh Postnatal Depression Scale',
    category: 'Depresi',
    maxScore: 30,
    questions: [
      'Saya dapat tertawa dan melihat sisi lucu dari sesuatu?',
      'Saya menantikan sesuatu dengan gembira?',
      'Saya menyalahkan diri sendiri tanpa perlu ketika ada yang salah?',
      'Saya merasa cemas atau khawatir tanpa alasan yang jelas?',
      'Saya merasa takut atau panik tanpa alasan yang jelas?',
      'Hal-hal menumpuk dan saya tidak bisa mengatasinya?',
      'Saya merasa sangat tidak bahagia sehingga sulit tidur?',
      'Saya merasa sedih atau sengsara?',
      'Saya sangat tidak bahagia sehingga saya menangis?',
      'Pikiran untuk menyakiti diri sendiri telah terjadi pada saya?',
    ],
    interpretScore: (score) => {
      if (score <= 9) return 'Tidak mengalami depresi postnatal';
      if (score <= 12) return 'Kemungkinan depresi postnatal ringan';
      return 'Kemungkinan depresi postnatal sedang-berat';
    },
  },
  gad7: {
    title: 'GAD-7 - Generalized Anxiety Disorder',
    category: 'Kecemasan',
    maxScore: 21,
    questions: [
      'Merasa gugup, cemas, atau tegang?',
      'Tidak dapat menghentikan atau mengontrol kekhawatiran?',
      'Terlalu khawatir tentang berbagai hal?',
      'Kesulitan bersantai?',
      'Merasa gelisah sehingga sulit duduk diam?',
      'Mudah terganggu atau lekas marah?',
      'Merasa seolah-olah sesuatu yang buruk akan terjadi?',
    ],
    interpretScore: (score) => {
      if (score <= 4) return 'Kecemasan minimal';
      if (score <= 9) return 'Kecemasan ringan';
      if (score <= 14) return 'Kecemasan sedang';
      return 'Kecemasan berat';
    },
  },
  bai: {
    title: 'BAI - Beck Anxiety Inventory',
    category: ' Kecemasan',
    maxScore: 63,
    questions: [
      'Mati rasa atau kesemutan?',
      'Merasa panas?',
      'Kaki gemetar?',
      'Tidak dapat bersantai?',
      'Takut hal terburuk akan terjadi?',
      'Pusing atau kepala ringan?',
      'Jantung berdebar kencang?',
      'Tidak stabil?',
      'Merasa ketakutan?',
      'Gugup?',
      'Merasa tersedak?',
      'Tangan gemetar?',
      'Gemetar?',
      'Takut kehilangan kendali?',
      'Kesulitan bernapas?',
      'Takut mati?',
      'Merasa takut?',
      'Gangguan pencernaan?',
      'Merasa pingsan?',
      'Wajah memerah?',
      'Berkeringat (tidak karena panas)?',
    ],
    interpretScore: (score) => {
      if (score <= 21) return 'Kecemasan minimal';
      if (score <= 35) return 'Kecemasan ringan';
      if (score <= 48) return 'Kecemasan sedang';
      return 'Kecemasan berat';
    },
  },
  dass: {
    title: 'DASS-21 - Depression Anxiety Stress Scale',
    category: 'Stres',
    maxScore: 63,
    questions: [
      'Sulit untuk bersantai?',
      'Mulut terasa kering?',
      'Tidak dapat merasakan perasaan positif sama sekali?',
      'Mengalami kesulitan bernapas?',
      'Sulit untuk memulai melakukan sesuatu?',
      'Cenderung bereaksi berlebihan terhadap situasi?',
      'Mengalami gemetar (misalnya di tangan)?',
      'Merasa menggunakan banyak energi nervous?',
      'Khawatir tentang situasi di mana saya mungkin panik?',
      'Merasa tidak ada yang bisa dinanti-nantikan?',
      'Merasa gelisah?',
      'Sulit untuk bersabar?',
      'Merasa sedih dan depresi?',
      'Tidak toleran terhadap apa pun yang menghentikan saya?',
      'Merasa hampir panik?',
      'Tidak dapat antusias tentang apa pun?',
      'Merasa tidak berharga sebagai seseorang?',
      'Merasa agak sensitif?',
      'Menyadari aksi jantung tanpa olahraga fisik?',
      'Merasa takut tanpa alasan yang baik?',
      'Merasa hidup tidak berarti?',
    ],
    interpretScore: (score) => {
      if (score <= 14) return 'Normal';
      if (score <= 21) return 'Ringan';
      if (score <= 28) return 'Sedang';
      if (score <= 42) return 'Berat';
      return 'Sangat berat';
    },
  },
  'stres-check': {
    title: 'Skrining Stres',
    category: 'Stres',
    maxScore: 30,
    questions: [
      'Merasa kewalahan dengan tanggung jawab?',
      'Sulit tidur karena pikiran yang tidak berhenti?',
      'Mudah tersinggung atau marah pada hal kecil?',
      'Merasa lelah meskipun sudah cukup tidur?',
      'Kehilangan nafsu makan atau makan berlebihan?',
      'Sulit berkonsentrasi pada pekerjaan?',
      'Merasa tegang di leher atau bahu?',
      'Menghindari aktivitas sosial?',
      'Merasa tidak dapat mengatasi masalah?',
      'Mengalami sakit kepala sering?',
    ],
    interpretScore: (score) => {
      if (score <= 10) return 'Stres minimal';
      if (score <= 20) return 'Stres sedang';
      return 'Stres tinggi';
    },
  },
  isi: {
    title: 'ISI - Insomnia Severity Index',
    category: 'Gangguan Tidur',
    maxScore: 28,
    questions: [
      'Kesulitan tidur (sulit memulai tidur)?',
      'Kesulitan mempertahankan tidur (sering terbangun)?',
      'Bangun terlalu pagi dan tidak bisa tidur kembali?',
      'Seberapa puas Anda dengan pola tidur Anda saat ini?',
      'Seberapa banyak tidur Anda mengganggu fungsi harian Anda?',
      'Seberapa mencolok gangguan tidur Anda bagi orang lain?',
      'Seberapa khawatir Anda tentang masalah tidur Anda saat ini?',
    ],
    interpretScore: (score) => {
      if (score <= 7) return 'Tidak mengalami insomnia';
      if (score <= 14) return 'Insomnia ringan';
      if (score <= 21) return 'Insomnia sedang';
      return 'Insomnia berat';
    },
  },
  pcl5: {
    title: 'PCL-5 - PTSD Checklist',
    category: 'Trauma / PTSD',
    maxScore: 80,
    questions: [
      'Ingatan berulang yang mengganggu tentang pengalaman stres?',
      'Mimpi buruk berulang tentang pengalaman stres?',
      'Tiba-tiba merasa seolah pengalaman stres terjadi lagi?',
      'Merasa sangat kesal ketika sesuatu mengingatkan pengalaman stres?',
      'Reaksi fisik ketika sesuatu mengingatkan pengalaman stres?',
      'Menghindari ingatan, pikiran, atau perasaan terkait pengalaman stres?',
      'Menghindari hal eksternal yang mengingatkan pengalaman stres?',
      'Kesulitan mengingat bagian penting dari pengalaman stres?',
      'Keyakinan negatif yang kuat tentang diri sendiri atau dunia?',
      'Menyalahkan diri sendiri atau orang lain untuk pengalaman stres?',
      'Perasaan negatif yang kuat (takut, horor, marah, bersalah, malu)?',
      'Kehilangan minat pada aktivitas yang Anda nikmati?',
      'Merasa jauh atau terputus dari orang lain?',
      'Kesulitan mengalami perasaan positif?',
      'Perilaku iritabel, ledakan kemarahan, atau agresi verbal/fisik?',
      'Mengambil terlalu banyak risiko atau melakukan hal berbahaya?',
      'Sangat waspada atau berjaga-jaga?',
      'Mudah terkejut?',
      'Masalah konsentrasi?',
      'Kesulitan jatuh atau tertidur?',
    ],
    interpretScore: (score) => {
      if (score < 33) return 'Gejala PTSD minimal';
      if (score < 45) return 'Kemungkinan PTSD ringan';
      if (score < 58) return 'Kemungkinan PTSD sedang';
      return 'Kemungkinan PTSD berat';
    },
  },
  audit: {
    title: 'AUDIT - Alcohol Use Disorder Identification Test',
    category: 'Penyalahgunaan Zat',
    maxScore: 40,
    questions: [
      'Seberapa sering Anda minum alkohol?',
      'Berapa banyak minuman beralkohol yang Anda konsumsi pada hari biasa?',
      'Seberapa sering Anda minum 6 atau lebih minuman dalam satu kesempatan?',
      'Seberapa sering dalam setahun terakhir Anda tidak dapat berhenti minum?',
      'Seberapa sering Anda gagal melakukan apa yang diharapkan karena minum?',
      'Seberapa sering Anda perlu minum di pagi hari untuk merasa baik?',
      'Seberapa sering Anda merasa bersalah atau menyesal setelah minum?',
      'Seberapa sering Anda tidak dapat mengingat apa yang terjadi karena minum?',
      'Apakah Anda atau orang lain pernah terluka karena minum Anda?',
      'Apakah ada yang menyarankan Anda mengurangi minum?',
    ],
    interpretScore: (score) => {
      if (score <= 7) return 'Konsumsi alkohol berisiko rendah';
      if (score <= 15) return 'Konsumsi alkohol berisiko sedang';
      if (score <= 19) return 'Konsumsi alkohol berbahaya';
      return 'Kemungkinan ketergantungan alkohol';
    },
  },
  oci: {
    title: 'OCI-R - Obsessive Compulsive Inventory-Revised',
    category: 'OCD (Obsessive Compulsive)',
    maxScore: 72,
    questions: [
      'Saya memiliki pikiran yang menyelamatkan saya dari bahaya?',
      'Saya memeriksa hal-hal lebih dari yang diperlukan?',
      'Saya takut jika saya tidak hati-hati, saya akan terluka atau sakit?',
      'Saya kesulitan mengendalikan pikiran saya sendiri?',
      'Saya mencuci tangan saya lebih dari yang diperlukan?',
      'Saya mengumpulkan hal-hal yang tidak saya butuhkan?',
      'Saya memeriksa berulang-ulang bahwa pintu terkunci?',
      'Saya merasa perlu mengulangi angka tertentu?',
      'Kadang saya takut saya mungkin menyakiti seseorang?',
      'Saya khawatir tentang kuman dan penyakit?',
      'Saya dapat dengan mudah membuang hal-hal yang tidak saya butuhkan?',
      'Saya memeriksa berulang-ulang bahwa alat listrik dimatikan?',
      'Saya perlu melakukan sesuatu berulang-ulang sampai terasa benar?',
      'Saya khawatir saya mungkin bertindak impulsif?',
      'Saya khawatir saya akan terkontaminasi jika menyentuh sesuatu?',
      'Saya kesulitan membuang hal-hal karena saya mungkin membutuhkannya?',
      'Saya memeriksa berulang-ulang bahwa saya tidak membuat kesalahan?',
      'Saya takut pikiran buruk atau menakutkan saya?',
    ],
    interpretScore: (score) => {
      if (score <= 20) return 'Gejala OCD minimal';
      if (score <= 30) return 'Gejala OCD ringan';
      if (score <= 40) return 'Gejala OCD sedang';
      return 'Gejala OCD berat';
    },
  },
};

const getScoreColor = (score: number, maxScore: number, result: string): string => {
  const percentage = (score / maxScore) * 100;
  if (result.includes('minimal') || result.includes('Normal') || result.includes('Tidak')) {
    return 'text-green-600 bg-green-50 border-green-200';
  } else if (result.includes('ringan') || result.includes('Ringan')) {
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  } else if (result.includes('sedang') || result.includes('Sedang')) {
    return 'text-orange-600 bg-orange-50 border-orange-200';
  } else {
    return 'text-red-600 bg-red-50 border-red-200';
  }
};

const QuizPage = () => {
    const searchParams = useSearchParams();
    const testSlug = searchParams.get('test') || '';
    const test = testData[testSlug];
  
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showProgress, setShowProgress] = useState(true);
  
    if (!test) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Tes Tidak Ditemukan</h2>
              <p className="text-gray-600">Silakan pilih tes yang valid dari daftar yang tersedia.</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  
    const handleAnswer = (value: number) => {
      setAnswers((prev) => [...prev, value]);
      
      if (currentQuestion < test.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setShowProgress(false);
      }
    };
  
    const resetTest = () => {
      setAnswers([]);
      setCurrentQuestion(0);
      setShowProgress(true);
    };
  
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const resultLabel = test.interpretScore(totalScore);
    const progress = ((currentQuestion) / test.questions.length) * 100;
    const scoreColor = getScoreColor(totalScore, test.maxScore, resultLabel);
  
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{test.category.split(' ')[0]}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{test.title}</h1>
            <p className="text-gray-600">{test.category}</p>
          </div>
  
          {currentQuestion < test.questions.length ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              {showProgress && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-600">
                      {currentQuestion} / {test.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-800 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
  
              {/* Question Card */}
              <Card className="shadow-lg border border-gray-200">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-bold">
                        {currentQuestion + 1}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Dalam 2 minggu terakhir, seberapa sering Anda mengalami:
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed pl-11">
                      {test.questions[currentQuestion]}
                    </p>
                  </div>
  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 0, label: 'Tidak Pernah', desc: 'Tidak pernah mengalami' },
                      { value: 1, label: 'Kadang-kadang', desc: 'Beberapa hari' },
                      { value: 2, label: 'Sering', desc: 'Lebih dari setengah hari' },
                      { value: 3, label: 'Sangat Sering', desc: 'Hampir setiap hari' },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="justify-start h-auto p-4 text-left hover:bg-purple-50 hover:border-purple-800 transition-all duration-200 border-gray-300"
                        onClick={() => handleAnswer(option.value)}
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                            {option.value}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              <Card className="shadow-lg border border-gray-200">
                <CardContent className="p-8 text-center">
              
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tes Selesai!</h2>
                  <p className="text-gray-600 mb-8">
                    Terima kasih telah menyelesaikan {test.title}
                  </p>
  
                  {/* Score Display */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                    <div className="flex justify-center items-center gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold text-purple-800`}>
                          {totalScore}
                        </div>
                        <div className="text-sm text-gray-500">dari {test.maxScore}</div>
                      </div>
                      <div className="w-px h-12 bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {Math.round((totalScore / test.maxScore) * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">skor</div>
                      </div>
                    </div>
                  </div>
  
                  {/* Result Interpretation */}
                  <div className="rounded-xl p-6 border-2 border-purple-800 bg-purple-50 mb-8">
                    <h3 className="text-xl font-bold mb-2 text-purple-800">Hasil Interpretasi</h3>
                    <p className="text-lg font-semibold text-purple-700">{resultLabel}</p>
                  </div>
  
                  {/* Disclaimer */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-amber-800 mb-2">⚠️ Penting untuk Diingat</h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Hasil ini hanya untuk skrining awal dan tidak menggantikan diagnosis profesional. 
                      Jika Anda merasa membutuhkan bantuan, silakan konsultasi dengan psikolog atau 
                      profesional kesehatan mental yang qualified.
                    </p>
                  </div>
  
                  <div className="flex gap-4 justify-center">
                    <Button onClick={resetTest} className="bg-purple-800 hover:bg-purple-900 text-white">
                      Ulangi Tes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.history.back()}
                      className="border-purple-800 text-purple-800 hover:bg-purple-50"
                    >
                      ← Kembali ke Daftar Tes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  };
export default QuizPage;