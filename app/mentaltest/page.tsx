'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const testList = [
  {
    category: 'Depresi',
    tests: [
      { name: 'PHQ-9', description: '9 pertanyaan — Ringan, populer', slug: 'phq9' },
      { name: 'BDI', description: '21 pertanyaan — Lebih mendalam', slug: 'bdi' },
      { name: 'EPDS', description: '10 pertanyaan — Untuk ibu setelah melahirkan', slug: 'epds' },
      { name: 'DASS', description: 'Gabungan Depresi, Kecemasan, dan Stres', slug: 'dass' },
    ],
  },
  {
    category: 'Kecemasan',
    tests: [
      { name: 'GAD-7', description: '7 pertanyaan — Ringan, populer', slug: 'gad7' },
      { name: 'BAI', description: '21 pertanyaan — Fokus fisik dan emosi', slug: 'bai' },
    ],
  },
  {
    category: 'Stres',
    tests: [
      { name: 'DASS', description: 'DASS-21/42 — Skala stres terpisah', slug: 'dass' },
      { name: 'Skrining Stres', description: 'Apakah saya mengalami stres berlebihan?', slug: 'stres-check' },
    ],
  },
  {
    category: 'Gangguan Tidur',
    tests: [
      { name: 'ISI', description: '7 pertanyaan — Insomnia Severity Index', slug: 'isi' },
    ],
  },
  {
    category: 'Trauma / PTSD',
    tests: [
      { name: 'PCL-5', description: '20 pertanyaan — PTSD Checklist', slug: 'pcl5' },
    ],
  },
  {
    category: 'Penyalahgunaan Zat',
    tests: [
      { name: 'AUDIT', description: '10 pertanyaan — Alkohol', slug: 'audit' },
    ],
  },
  {
    category: 'OCD (Obsessive Compulsive)',
    tests: [
      { name: 'OCI-R', description: '18 pertanyaan — Obsessive Compulsive Inventory - Revised', slug: 'oci' },
    ],
  },
];

const MentalTestHome = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tes Kesehatan Mental
          </h1>
          <p className="text-gray-600">
            Pilih tes yang sesuai dengan kondisi yang ingin Anda periksa
          </p>
        </div>

        {/* Test Categories */}
        <div className="space-y-8">
          {testList.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-900 border-b border-purple-100 pb-2">
                {section.category}
              </h2>
              
              <div className="space-y-3">
                {section.tests.map((test, index) => (
                  <Card key={index} className="border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {test.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {test.description}
                          </p>
                        </div>
                        
                        <div className="ml-6">
                          <Link href={`/mentaltest/quiz?test=${test.slug}`}>
                            <Button 
                              className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-2 text-sm font-medium"
                            >
                              Mulai Tes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> Tes ini hanya sebagai skrining awal dan tidak menggantikan konsultasi dengan profesional kesehatan mental. Hasil tes bukan diagnosis resmi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalTestHome;