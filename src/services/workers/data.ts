
import { Worker } from './types';

// Mock database of workers
export const workers: Worker[] = [
  {
    id: 'w1',
    name: 'Daniel Ochieng',
    profession: 'Plumber',
    skills: ['Pipe fitting', 'Leak repair', 'Bathroom installation'],
    languages: ['English', 'Swahili', 'Luo'],
    location: 'Nairobi, Kenya',
    rating: 4.8,
    imageUrl: '/lovable-uploads/2445fe07-21dd-4442-b847-d276a6e415bb.png',
    hourlyRate: 25
  },
  {
    id: 'w2',
    name: 'Amina Nkosi',
    profession: 'Electrician',
    skills: ['Wiring', 'Circuit repair', 'Installation'],
    languages: ['English', 'Zulu', 'Xhosa'],
    location: 'Cape Town, South Africa',
    rating: 4.9,
    imageUrl: '/lovable-uploads/ff3e073f-f3ef-417e-bdbc-3010a8a80a24.png',
    hourlyRate: 30
  },
  {
    id: 'w3',
    name: 'Kwame Mensah',
    profession: 'Carpenter',
    skills: ['Furniture making', 'Woodworking', 'Cabinet installation'],
    languages: ['English', 'Twi', 'Ga'],
    location: 'Accra, Ghana',
    rating: 4.7,
    imageUrl: '/lovable-uploads/98983439-7614-4880-88e0-e3ace1184681.png',
    hourlyRate: 22
  },
  {
    id: 'w4',
    name: 'Fatima Diallo',
    profession: 'HVAC Technician',
    skills: ['AC repair', 'Heating systems', 'Ventilation'],
    languages: ['French', 'Wolof', 'English'],
    location: 'Dakar, Senegal',
    rating: 4.6,
    imageUrl: '/lovable-uploads/8b3c299c-abcf-4fff-8cb2-b1da3cf60b03.png',
    hourlyRate: 28
  },
  {
    id: 'w5',
    name: 'Kofi Adebayo',
    profession: 'Painter',
    skills: ['Interior painting', 'Exterior painting', 'Decorative finishes'],
    languages: ['English', 'Yoruba', 'Hausa'],
    location: 'Lagos, Nigeria',
    rating: 4.5,
    imageUrl: '/lovable-uploads/023a30b8-39a0-4f6b-b89e-c25b25a3f54f.png',
    hourlyRate: 20
  },
  {
    id: 'w6',
    name: 'Ahmed Musa',
    profession: 'Developer',
    skills: ['Web development', 'Mobile apps', 'UI/UX design'],
    languages: ['English', 'Arabic', 'Hausa'],
    location: 'Kano, Nigeria',
    rating: 4.9,
    imageUrl: '/lovable-uploads/fdfb621b-5ad8-4ba5-b9bf-7bf2d11015f0.png',
    hourlyRate: 35
  },
  {
    id: 'w7',
    name: 'Dlamini Zuma',
    profession: 'Mechanic',
    skills: ['Engine repair', 'Diagnostics', 'Transmission repair'],
    languages: ['English', 'Zulu', 'Sotho'],
    location: 'Johannesburg, South Africa',
    rating: 4.7,
    imageUrl: '/lovable-uploads/048d1c23-d27d-4406-ade3-471a6d24a70c.png',
    hourlyRate: 28
  },
  {
    id: 'w8',
    name: 'Chinedu Okonkwo',
    profession: 'Car Electrician',
    skills: ['Auto wiring', 'ECU diagnostics', 'Battery systems'],
    languages: ['English', 'Igbo', 'Pidgin'],
    location: 'Lagos, Nigeria',
    rating: 4.6,
    imageUrl: '/lovable-uploads/ff3e073f-f3ef-417e-bdbc-3010a8a80a24.png',
    hourlyRate: 25
  },
  {
    id: 'w9',
    name: 'Adama Traore',
    profession: 'Vulcanizer',
    skills: ['Tire repair', 'Wheel balancing', 'Tire replacement'],
    languages: ['French', 'Bambara', 'Wolof'],
    location: 'Bamako, Mali',
    rating: 4.4,
    imageUrl: '/lovable-uploads/2445fe07-21dd-4442-b847-d276a6e415bb.png',
    hourlyRate: 18
  },
  {
    id: 'w10',
    name: 'Ngozi Okafor',
    profession: 'Fashion Designer',
    skills: ['Tailoring', 'Pattern making', 'Traditional attire'],
    languages: ['English', 'Igbo', 'Yoruba'],
    location: 'Abuja, Nigeria',
    rating: 4.8,
    imageUrl: '/lovable-uploads/8b3c299c-abcf-4fff-8cb2-b1da3cf60b03.png',
    hourlyRate: 30
  },
  {
    id: 'w11',
    name: 'Ibrahim Seck',
    profession: 'Bricklayer',
    skills: ['Masonry', 'Concrete work', 'Tile setting'],
    languages: ['French', 'Wolof', 'English'],
    location: 'Dakar, Senegal',
    rating: 4.6,
    imageUrl: '/lovable-uploads/2445fe07-21dd-4442-b847-d276a6e415bb.png',
    hourlyRate: 22
  },
  {
    id: 'w12',
    name: 'Samuel Adekunle',
    profession: 'Panel Beater',
    skills: ['Auto body repair', 'Dent removal', 'Spray painting'],
    languages: ['English', 'Yoruba', 'Pidgin'],
    location: 'Lagos, Nigeria',
    rating: 4.7,
    imageUrl: '/lovable-uploads/048d1c23-d27d-4406-ade3-471a6d24a70c.png',
    hourlyRate: 26
  },
  {
    id: 'w13',
    name: 'Emmanuel Banda',
    profession: 'Scaffolder',
    skills: ['Scaffold erection', 'Safety inspection', 'Dismantling'],
    languages: ['English', 'Nyanja', 'Bemba'],
    location: 'Lusaka, Zambia',
    rating: 4.5,
    imageUrl: '/lovable-uploads/fdfb621b-5ad8-4ba5-b9bf-7bf2d11015f0.png',
    hourlyRate: 28
  },
  {
    id: 'w14',
    name: 'Fatoumata Keita',
    profession: 'Cook',
    skills: ['Local cuisine', 'Continental dishes', 'Catering'],
    languages: ['French', 'Bambara', 'Wolof'],
    location: 'Bamako, Mali',
    rating: 4.9,
    imageUrl: '/lovable-uploads/8b3c299c-abcf-4fff-8cb2-b1da3cf60b03.png',
    hourlyRate: 25
  },
  {
    id: 'w15',
    name: 'Joseph Okoro',
    profession: 'Driver',
    skills: ['Commercial driving', 'Defensive driving', 'Vehicle maintenance'],
    languages: ['English', 'Igbo', 'Pidgin'],
    location: 'Enugu, Nigeria',
    rating: 4.6,
    imageUrl: '/lovable-uploads/023a30b8-39a0-4f6b-b89e-c25b25a3f54f.png',
    hourlyRate: 20
  },
  {
    id: 'w16',
    name: 'Tendai Moyo',
    profession: 'Rigger',
    skills: ['Load handling', 'Signal operations', 'Equipment setup'],
    languages: ['English', 'Shona', 'Ndebele'],
    location: 'Harare, Zimbabwe',
    rating: 4.7,
    imageUrl: '/lovable-uploads/98983439-7614-4880-88e0-e3ace1184681.png',
    hourlyRate: 30
  },
  {
    id: 'w17',
    name: 'Mamadou Diop',
    profession: 'Climber',
    skills: ['Height work', 'Safety procedures', 'Equipment handling'],
    languages: ['French', 'Wolof', 'English'],
    location: 'Dakar, Senegal',
    rating: 4.8,
    imageUrl: '/lovable-uploads/ff3e073f-f3ef-417e-bdbc-3010a8a80a24.png',
    hourlyRate: 35
  }
];
