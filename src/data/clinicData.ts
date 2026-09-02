import { ConditionItem, ServiceItem, JourneyStep, SuccessStory, Specialist, GalleryItem, FAQItem } from '../types';

export const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDejnQxAZkMcrWkBDwi6bUddhcEHzeU2HUOsRwr5_3LVK3MfLYVkdtDBl_hSk21OxzXnPxNT4nl3uNUhWyVX-N2DO5SnO2BBhN_rkB275LqQxrUoTZKiKoctZG2_AZIQQWRX4gr_VBYOxMvTImV5KRBpTyO6AYolgZstPiqiXqsj7c_fQfM0b0Suaxn9MOOwCq-ah_pqKjkKg0SZbylB9hRjv-XlsxPihBFrICrkn1ArPEPhMxALO38";

export const CONDITIONS: ConditionItem[] = [
  {
    id: 'arthritis',
    title: 'Arthritis',
    category: 'degenerative',
    shortDesc: 'Managing pain and improving joint mobility for aging companions.',
    fullDesc: 'Osteoarthritis is a progressive joint disease affecting cartilage and surrounding bones. Our multi-modal rehabilitation targets stiffness, restores range of motion, and rebuilds muscular support without heavy pharmacological side effects.',
    symptoms: ['Difficulty rising from bed', 'Reluctance to climb stairs or jump', 'Limping or stiffness after rest', 'Licking specific joints'],
    recommendedTherapies: ['Laser Therapy', 'Hydrotherapy', 'Targeted Massage', 'Joint Supplements Plan'],
    expectedRecoveryTime: 'Ongoing maintenance & visible improvement within 3-4 weeks',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOgNL-gjqnC0wBg_bOL5-VaA7riWGDt8yinitZd_YHae2a9WFIGm6LjKsow3T5dYNWIu9v3habEmwWEDPBPM8th1pZACvXV3zqfx88GgpkQ_1ibFsEQ0pJk4ExB2lE0Ojy6jWSMO-M3jSASuw8mC5RcC3uaFB1jyGWf1-O8vgaLkWjohxXTWirFY3ls9HJXhIA8TjUOwl9lenAWnCxmjrCSLG64n1xUUAcsxlz_Tepyk2y97iDj3Gx',
    altText: 'Dog receiving gentle joint massage therapy for arthritis'
  },
  {
    id: 'ivdd',
    title: 'IVDD',
    category: 'neurological',
    shortDesc: 'Specialized neurological rehabilitation for spinal conditions.',
    fullDesc: 'Intervertebral Disc Disease affects the spinal column, leading to pain, weakness, or paralysis. Our conservative and post-op spinal protocol focuses on neural stimulation, spinal alignment, proprioceptive re-education, and underwater treadmill walking.',
    symptoms: ['Back pain or arched spine', 'Hind leg weakness or knuckling', 'Incontinence or difficulty standing', 'Shaking or reluctance to move head'],
    recommendedTherapies: ['Electro-acupuncture & TENS', 'Hydrotherapy Underwater Treadmill', 'Class IV Laser', 'Neuromuscular Electrical Stimulation'],
    expectedRecoveryTime: '6 to 16 weeks based on severity (Grade I to V)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpcya24ze5l5IDEtrIV1cA9IpgXIqozowsHHO8l6D89ttYFqye-buMv3Zfo3MoJmSjUWeecGKcjpSXrp7EGEth-Qcm555uOp19mQ2HqvzR-VHI_8i6MxSZkvWYCMskb5aLKi3knBWn1moldd0XB58ooCqN4x17NgQq1E1saCULCwxjjjXo4oLvdCPX9XbBYKxljXTgiWqpoI3O-ySifnIvT0nBeSenhtH8TIXBlVotIDeQ6CXm0SVR',
    altText: 'Dachshund supported on underwater treadmill for IVDD spinal recovery'
  },
  {
    id: 'hip-dysplasia',
    title: 'Hip Dysplasia',
    category: 'degenerative',
    shortDesc: 'Strengthening musculature to support and stabilize the hip joints.',
    fullDesc: 'A congenital condition where the hip socket fails to fully cover the ball portion of the upper thighbone. Specialized targeted exercise regimens build gluteal and pelvic stabilization muscles, drastically reducing bone-on-bone friction.',
    symptoms: ['Bunny-hopping gait when running', 'Narrow stance in hind legs', 'Decreased hip joint flexibility', 'Loss of thigh muscle mass'],
    recommendedTherapies: ['Physiotherapy', 'Therapeutic Exercise (Peanut Ball)', 'Underwater Treadmill', 'Cryotherapy & Heat Modalities'],
    expectedRecoveryTime: '6 to 8 weeks for baseline stabilization',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWOALUCpPzB5Y48NeeAIMH1krV-26VzLU8CBjGtyCfSCsGVwNbQxlr4cpMbTK7jpQEGpgrgvhghtk_NSM9ysyH0tIvZHm4l7TR25RxG6dzG5DxBZawa37qGWu9G3rs3uLlIDHEy251XixCQs8R61E6sSOYMiT7PX1AozXa7K-NMA0rWEZ7W99P8gf-o7AZLJBT8AYyZX822P_PI0jPyCppt9M4qJDXlb_Z8zKfhIwNskreTHLNrYuj',
    altText: 'Golden Retriever doing core stabilization on a peanut ball'
  },
  {
    id: 'post-surgical',
    title: 'Post Surgical Rehab',
    category: 'post-op',
    shortDesc: 'Accelerated and safe recovery protocols following orthopedic procedures.',
    fullDesc: 'Essential care post-TPLO, CCL repair, FHO, or fracture repair. We work closely with your surgeon to control post-op edema, promote surgical site incisional healing, prevent muscle atrophy, and re-establish a natural symmetrical gait.',
    symptoms: ['Surgical site swelling', 'Non-weight bearing limb stance', 'Stiffness after cage rest', 'Loss of range of motion'],
    recommendedTherapies: ['Class IV Laser Therapy', 'Passive Range of Motion (PROM)', 'Controlled Aquatic Gait Retraining', 'Home Cryotherapy Protocol'],
    expectedRecoveryTime: '8 to 12 weeks guided post-op milestones',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvI-3WE-lGQXdcDD20B1xiQ2Lhi0bDwyT675vXAGmNsMtx1xrKI-kRU9rokOTsCv8SJg30BqpHc2IVtTighJP_HRFNYq5K-lqqkjygLHTEKlwZR_votGvlUT7nLcjN-WlKHbxbbGJaJKZlBbO0mOne32osndTrNmIcF7mqX9aBB6TepzRQ2fxo0YJoF-UxlORjeJA1OFa5Vy2gPSSNSH9pfo7BU_rMnFzQJc3Dcgr-tbAw4RiRTTSn',
    altText: 'Veterinarian gently examining dog post knee surgery'
  },
  {
    id: 'neurological-recovery',
    title: 'Neurological Recovery',
    category: 'neurological',
    shortDesc: 'Retraining pathways to restore balance, coordination, and mobility.',
    fullDesc: 'Targeted neurological rehab for spinal stroke (FCE), degenerative myelopathy (DM), cerebellar ataxia, and nerve trauma. We stimulate neuroplasticity using proprioceptive tracks, wobble boards, and aquatic buoyancy.',
    symptoms: ['Loss of paw position awareness', 'Unsteady, wobbling gait', 'Weakness in all limbs', 'Difficulty keeping balance'],
    recommendedTherapies: ['Proprioceptive Circuit Exercises', 'Electrical Muscle Stimulation', 'Hydrotherapy', 'Laser Therapy'],
    expectedRecoveryTime: '8 to 20 weeks individualized neural program',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5UeByUqIKRa0dshbpNaG5TpQ0vFKLn-IocfE8_XwSM_q-nH5yrd4zWYsEepp00mLboqJQQQ6cspzH_NfHibdJne0cSYC2jMZ-fyKp7ltTQ-qAq1hEaC4rW0yLPclwH1-tSFku-wJVw1tvTkWjKkxlTRlIM23qc0Y105YQJaVcz2RntNixEPu5PrAvCuhj0zaMT-5AZIvPKdEY9NldGb_bFAc3w22kilSF7hEy3-XFco-l8v8VGjv3',
    altText: 'Dog undergoing neurological balance and coordination training'
  },
  {
    id: 'sports-injury',
    title: 'Sports Injury',
    category: 'lifestyle',
    shortDesc: 'Targeted recovery plans to get your active dog back to peak performance.',
    fullDesc: 'Agility, flyball, working dogs, and energetic companions frequently suffer tendonitis, iliopsoas strains, and ligament sprains. Our biomechanical evaluation isolates subtle compensations and repairs tissue integrity.',
    symptoms: ['Shortened stride length', 'Reluctance to jump obstacles', 'Intermittent lameness after exercise', 'Local muscle twitching or soreness'],
    recommendedTherapies: ['High-Power Laser', 'Myofascial Trigger Point Release', 'Aquatic Conditioning', 'Plyometric Strength Building'],
    expectedRecoveryTime: '4 to 10 weeks to return to agility & outdoor sports',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtr-022SXsB1NTBRLaXQRGaW7oir_XGpluV1e2iB7vsWYKAaKjYVUIbJH9h4D1SfHb0ip1XzWp_O1wrnKVxvIf8R6lLS28qeLBlhGSQyb-97-HOzcgXIOaA00mPnNytYgzQP6ujWDsk9ywdvWtnhTkCtROhjYS5hWQOKpPSmn7ZsYzIpP6L-YbtcWGHWVyuvxvYc6N9CNRq41IRDecnDU3MlbPcSU8xttqjgpEcB-amjmxckgXCCs8',
    altText: 'Athletic agility dog training and undergoing injury conditioning'
  },
  {
    id: 'senior-mobility',
    title: 'Senior Mobility',
    category: 'lifestyle',
    shortDesc: 'Gentle therapies designed to maintain independence and comfort in older age.',
    fullDesc: 'Aging pets deserve dignity, comfort, and vital motion. Our senior care plans safely boost endurance, maintain core muscle tone, ease stiff spinal joints, and enhance mental engagement in a low-stress environment.',
    symptoms: ['Slipping on hardwood floors', 'Slower walk speed', 'Muscle wasting in hips', 'Vocalizing when standing'],
    recommendedTherapies: ['Gentle Massage', 'Warm Water Hydrotherapy Walk', 'Low-Impact Balance Matting', 'Nonslip Assistive Gear Consultation'],
    expectedRecoveryTime: 'Continuous weekly or bi-weekly comfort care program',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKF6FGM81GUAtKVIRXHExNqGYjoBmY1_dX3XI9ywDCPlO6OTk-_xo-ysi6LHjXx9f3BGBU9ZAd_y-eewRU_wVWAt5PGf48yFZO_PJsXsgmdUmiHsBjYoOZSx68zuKATGHpJqfO9JYxKE_Zk9s02qUzelrLdYME86vhydM-DOO_0P6l82WlWKJixoe_6KestRf_W80gEt9XaWgIX2GK7JAB7d8MfbyJ172-wMMXgQjVCOGwuCurClCf',
    altText: 'Senior dog comfortably resting in a warm rehabilitation clinic'
  },
  {
    id: 'obesity-rehab',
    title: 'Obesity Rehab',
    category: 'lifestyle',
    shortDesc: 'Safe, structured exercise programs for healthy weight management.',
    fullDesc: 'Excess weight severely compounds joint stress, heart strain, and diabetes risk. Underwater treadmill exercise burns up to 3x more calories than land walking while eliminating joint impact thanks to aquatic buoyancy.',
    symptoms: ['Inability to feel ribcage easily', 'Excessive panting during short walks', 'Lethargy and low stamina', 'Difficulty grooming'],
    recommendedTherapies: ['Underwater Treadmill Fat Burn', 'Targeted Metabolic Caloric Plan', 'Land Resistance Walks', 'Progressive Weight Milestones'],
    expectedRecoveryTime: '8 to 16 weeks target body condition restoration',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmDWgI1fS9Ph9ngrwa3L9PHwN7DzI3mZPsCTEiQO_-9yP6lAPBlmU6muhXOSQ0zpEmw8rR0watnXCvI31JOoyPBeYciqUA3x1eapZE6h5E1XCxrUWM5uDitc5G2Jj_K57z7Dly70y3co2fBZyFTpU5YtQlBVZgSOwnUkRC5XsqGnXRurn3qa8r-hZAPxTy_nZlIg3yKW01Qf1z0EbUr1xuUOu5pPz_JBpuTT0t65K9HDSHh5B_h108',
    altText: 'Dog undergoing underwater treadmill weight management rehabilitation'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'physiotherapy',
    title: 'Physiotherapy',
    icon: 'healing',
    shortDesc: 'Expert manual assessment and treatment to restore joint mechanics and muscle function.',
    fullDesc: 'Comprehensive veterinary physiotherapy incorporates biomechanical gait analysis, goniometry, reflex mapping, and targeted manual manipulation to correct muscular imbalances and restore joint mechanics.',
    benefits: ['Restores natural joint range of motion', 'Decreases acute & chronic pain', 'Prevents compensatory muscle strain'],
    suitableFor: ['Post-surgical dogs', 'Arthritic seniors', 'Spinal cord injury patients'],
    duration: '45-60 min'
  },
  {
    id: 'hydrotherapy',
    title: 'Hydrotherapy',
    icon: 'pool',
    shortDesc: 'Low-impact underwater treadmill therapy for safe strengthening and cardiovascular fitness.',
    fullDesc: 'Utilizing warm water buoyancy, adjustable water depth, and calibrated treadmill speeds, pets build limb strength with up to 60% less joint load than on hard surfaces.',
    benefits: ['Low-impact cardiovascular conditioning', 'Re-builds lost muscle mass rapidly', 'Hydrostatic pressure reduces limb edema'],
    suitableFor: ['CCL / TPLO post-op', 'Hip dysplasia', 'Overweight or senior pets'],
    duration: '30-45 min'
  },
  {
    id: 'laser-therapy',
    title: 'Laser Therapy',
    icon: 'flashlight_on',
    shortDesc: 'Class IV laser treatments to accelerate tissue healing, reduce inflammation, and alleviate pain.',
    fullDesc: 'Photobiomodulation delivers targeted light wavelengths deep into cells, stimulating ATP cellular energy production, increasing local microcirculation, and relieving localized nerve pain.',
    benefits: ['Non-invasive, drug-free pain relief', 'Dramatically speeds wound & tendon healing', 'Calms nerve hypersensitivity'],
    suitableFor: ['Lick granulomas', 'Acute surgical incisions', 'Tendonitis and arthritis'],
    duration: '20-30 min'
  },
  {
    id: 'manual-therapy',
    title: 'Manual Therapy',
    icon: 'front_hand',
    shortDesc: 'Hands-on techniques including massage and joint mobilization for pain relief.',
    fullDesc: 'Hands-on myofascial decompression, trigger point therapy, passive stretching, and gentle joint oscillations reduce scar tissue adhesions and promote deep relaxation.',
    benefits: ['Releases tight muscle knots', 'Improves lymphatic fluid circulation', 'Reduces anxiety and tension'],
    suitableFor: ['Chronic stiffness', 'Post-exercise soreness', 'Anxious or nervous pets'],
    duration: '30-45 min'
  },
  {
    id: 'therapeutic-exercise',
    title: 'Therapeutic Exercise',
    icon: 'fitness_center',
    shortDesc: 'Targeted exercises using specialized equipment to build strength, balance, and proprioception.',
    fullDesc: 'Custom obstacle courses, cavaletti rails, wobble cushions, and balance peanut balls re-educate the nervous system and build core stabilization.',
    benefits: ['Enhances core core stability', 'Sharpen balance & spatial coordination', 'Builds confidence in movement'],
    suitableFor: ['Agility athletes', 'Neurological patients', 'Pre-hab before surgery'],
    duration: '30-45 min'
  },
  {
    id: 'home-exercise',
    title: 'Home Exercise Programs',
    icon: 'home',
    shortDesc: 'Customized plans for owners to continue their pet\'s rehabilitation safely at home.',
    fullDesc: 'Every patient receives a personalized digital home exercise plan complete with step-by-step video instructions, repetition counts, and progress tracking tools.',
    benefits: ['Continuity of care between clinic visits', 'Empowers pet parents with safe techniques', 'Faster overall recovery timeline'],
    suitableFor: ['All active patients', 'Owners seeking guided home routines'],
    duration: 'Included with Assessment'
  }
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: '01',
    title: 'Assessment',
    desc: 'Comprehensive evaluation of mobility and condition.',
    details: 'A thorough 60-minute consultation including gait analysis, muscle mass girth measurement, joint range-of-motion testing, and neurological reflex check.',
    whatToExpect: ['Medical history review', 'Symmetrical stance inspection', 'Goniometer joint range testing', 'Initial pain & comfort scoring']
  },
  {
    number: '02',
    title: 'Diagnosis',
    desc: 'Clear identification of the underlying issues.',
    details: 'Combining veterinary referral notes, digital palpation findings, and functional testing to pinpoint structural, muscular, or neurological limitations.',
    whatToExpect: ['Detailed biomechanical summary', 'Identification of compensation zones', 'Primary vs secondary pain mapping', 'Direct consultation with your primary vet']
  },
  {
    number: '03',
    title: 'Personalized Therapy',
    desc: 'A tailored plan utilizing various modalities.',
    details: 'Crafting a dedicated multi-week therapy schedule blending underwater treadmill, Class IV laser, manual joint mobilization, and acupuncture as needed.',
    whatToExpect: ['Hands-on therapeutic sessions', 'Gentle, zero-fear approach', 'Immediate post-treatment icing/heat', 'Customized treatment frequency (1-3x/week)']
  },
  {
    number: '04',
    title: 'Progress Tracking',
    desc: 'Regular monitoring and plan adjustments.',
    details: 'Re-evaluating muscle measurements and comfort metrics every 4 sessions to adapt exercise difficulty and track objective functional gains.',
    whatToExpect: ['Objective video gait comparisons', 'Re-measurement of limb girth', 'Home exercise plan progression', 'Transparent owner progress reports']
  },
  {
    number: '05',
    title: 'Recovery',
    desc: 'Restored mobility, less pain, and a happier life.',
    details: 'Graduating to maintenance or sports re-conditioning, ensuring your companion enjoys long-term, pain-free mobility and vitality.',
    whatToExpect: ['Graduation milestone certificate', 'Long-term maintenance recommendations', 'Seasonal check-in schedule', 'Full return to favorite activities']
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'bella',
    petName: 'Bella',
    breed: 'Golden Retriever',
    condition: 'Post-TPLO Surgery',
    quote: '"After her knee surgery, Bella was hesitant to use her leg. The hydrotherapy sessions worked wonders. Within weeks, she was walking normally again, and now she\'s back to chasing balls in the park. The team here is incredible!"',
    ownerName: 'Sarah & James M.',
    storyDetails: 'Bella suffered a complete cranial cruciate ligament tear. Following TPLO surgery, hydrotherapy helped rebuild 3cm of lost thigh circumference in 6 weeks.',
    duration: '6 Weeks Rehab',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxESYcuHSb78niLBE9VJVWpu39XZqAITld_5RBfCqPdz75K2dhQIZBwWhujOk7G5avkrIge644wbrb-dvpce9o1n_3VxHqX-neYTpNJ5sL35gbiipCutn_tslSIsn8tkthe35x7RTADcKtipMDcl0EMUOLTBXbqOXwk09SdZr_5aCfuEa3-3Q3jCei1CMqdFXncxdM9VdkDyqV98-CbplOE7q9fV3DzllOX7XwY_CIQAgXsZzpE6rd',
    altText: 'Bella the Golden Retriever after successful knee rehabilitation'
  },
  {
    id: 'max',
    petName: 'Max',
    breed: 'Dachshund',
    condition: 'IVDD Recovery',
    quote: '"We were terrified when Max went down in his back legs. The neurological rehab program gave him his mobility back. It was a long journey, but the laser therapy and targeted exercises were life-changing. He\'s walking independently now!"',
    ownerName: 'Elena R.',
    storyDetails: 'Max presented with Grade III IVDD hindlimb paraparesis. Conservative rehab combining laser photobiomodulation and underwater gait training restored full voluntary step placement.',
    duration: '12 Weeks Rehab',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0v1K4RUQusxZaKv2onCIKyqgeW5yqP6jGfgu5yE9GeN0yxXeLeiolqvbLb7s73q78GMNEydaWbCao9F74A1GQ_Uch_pHyZcAqCrFWOM6vYYQK9jrvQ_xU6eFuIN2orG-ksRXkQ53rSvxRltjgttwV2uizsMmxShaOOa5UDQ1m9TxlVUTu74wKPPtxj1vpBJu3YMGa54BYyN7lbBG_SYo8YpY1DhxOPCNk_Se5BI9tT15ZHDVKccpm',
    altText: 'Max the Dachshund standing proud after spinal recovery'
  }
];

export const SPECIALISTS: Specialist[] = [
  // The clinic's actual clinician, taken from its own production record
  // (UserProfile: Dhanvi Patel, role DOCTOR, clinic "Pet Physio Vet").
  //
  // This list previously held three people who do not work here — Dr. Sarah
  // Jenkins, Dr. Mark Roberts and Emma Davies — carried over from the site
  // template, complete with invented DVM/CCRP/RVN credentials, invented years
  // in practice, invented biographies and stock photographs. They were not
  // merely decorative: they had their own /specialists/* pages, they were
  // listed in the sitemap, they populated the "Preferred Specialist" dropdown
  // on the booking form, and they were published to Google as `employee`
  // Person nodes of a real, named veterinary business with
  // `EducationalOccupationalCredential` entries attached. Fabricated clinical
  // credentials for a real medical practice are not a placeholder problem.
  //
  // Everything below that is empty is empty ON PURPOSE. Every consumer of this
  // record skips a field it cannot fill, and `prune()` in seo/schema.ts drops
  // empty values from the JSON-LD, so nothing unverified reaches a visitor or
  // a search engine. Fill these in once the clinic supplies the real details.
  //
  // `credentials`, `bio` and `specialties` below are not written here from
  // scratch — every claim is a restatement of the clinic's own published
  // description in seo/siteConfig.ts, which was taken from its Google Business
  // listing: "Qualified veterinary physiotherapist (M.V.Sc.) treating mobility
  // problems, post-surgical recovery, arthritis and injury in dogs and cats,
  // with avian and exotic experience. Clinic visits at Sola, Science City
  // Road, and home visits across Ahmedabad." Nothing is added to it.
  //
  // `experienceYears` and `imageUrl` stay empty because no source states them,
  // and a guessed number of years in practice or a stock photograph of someone
  // else is exactly the failure this replacement exists to undo.
  {
    id: 'dhanvi-patel',
    name: 'Dr. Dhanvi Patel',
    role: 'Veterinary Physiotherapist',
    credentials: 'M.V.Sc.',
    bio:
      'Qualified veterinary physiotherapist (M.V.Sc.) treating mobility problems, '
      + 'post-surgical recovery, arthritis and injury in dogs and cats, with '
      + 'experience in avian and exotic patients. Sees patients at the Sola / '
      + 'Science City Road clinic and on home visits across Ahmedabad.',
    specialties: [
      'Mobility and gait problems',
      'Post-surgical recovery',
      'Arthritis management',
      'Injury rehabilitation',
      'Avian and exotic patients',
      'Home visits across Ahmedabad',
    ],
    experienceYears: 0,
    imageUrl: '',
    altText: 'Dr. Dhanvi Patel',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Welcoming Reception Area',
    category: 'Facility',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGgdcm16BlKgFq_hBIFONd_vAlFnQuok-UokDLqYVvX6S6VnUkn1t_iicDmhU7QJ19_8H1_b7WKNV-C5kxsx-UCTCCADUBxlA-v9HB-CAPG4zY-uGgvXAAczsoAmQYYW-36ksnzNl_eu9r-9Y49qOZ0sQuM6zyau-37liHVKyw_Lc7rOJKfk1qKBjlxfNJJhmK-5SN09bf74ZSkx3YjPoJedPDA-7rRe1g9-oCuEsbdkBLtIdSz_Xp',
    altText: 'Clinic reception area with modern calm warm aesthetic'
  },
  {
    id: 'g2',
    title: 'Hydrotherapy Suite & Underwater Treadmill',
    category: 'Hydrotherapy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzxT9AWdUNq3KyYBDyNayOMTg3SZwM0257gDy2fnGxlPb-EppUECbYXuABXMgmbMHm-3ZpHF_WCEAIg1t61--PYHo-YpVt4H4GJ8GvN3apDclLRW3EoriG-uCkzh6S0oYE_cg0dEsEsu0rG6SEglDSxpMDXU4-NnWjulpRhLFGZtszQqPD5c_BJmfYVrGzX1cPxW6MN1GwiwVN5aNeBYjlNjC3krglOEWA-eMdZbRmvbBOkTgA3EzU',
    altText: 'Clean state-of-the-art hydrotherapy treadmill tank'
  },
  {
    id: 'g3',
    title: 'Private Manual Therapy Suite',
    category: 'Physiotherapy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8gptZM_BVFQaexpq2gf8mPnEuRzWgbWbfCrHkUUiSqmEhZqaz2EumQ76gyufbJxfJhJzW8VBvV-MZhZUBhrMyaYN9FzPudOX2Uuyrn6CPzn0I3Nh68__s0EwP33PWnDX7b0waGKCLwu7QU_zxnFgpBXH6cFBoJz3vhKWCucgKiT4JIPaUuNsV88Dl9y0Xh59KKF902guyzPwbAv2nbwBLQa8FP_p0iBzmXaoZn11kHRP7nsFWjFOb',
    altText: 'Spacious therapy room with padded mats and warm lighting'
  },
  {
    id: 'g4',
    title: 'Core & Proprioception Training Area',
    category: 'Exercise',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8vQ8JyIdCwvtVu4t7nAHWGEflg9Grxt_xkK2kUQ2oYtBNzvkZRS8OF8tWzmSeHyhNSQ60qzZzUYdgHJRzgi9w0ZoFLAcDhsme3F42lBFwyIwopMNwlcZgk7IbdbS167G1YSESehvTnuw-q6lSYJYBOQlk4-gENTOhYWUDSBF-ZWv9K9zhQynaAfwwE09fKl1Zov8Xi3U07Yxm1Px-tkrQ33QrtG31Mr1HbXbKKRX92tMe75BqmmPi',
    altText: 'Dog balancing on peanut ball during core strengthening session'
  },
  {
    id: 'g5',
    title: 'Class IV Laser Photobiomodulation System',
    category: 'Technology',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVNgigtMPEqnG0AN6eDNbPF182JgleTYeAQX_1CqWk66QqQxa2Zy0MdW8Yri8sDQydDUrZTHR8mExXy-MSaSf6h0Ng_qJf83oqMk3yeoccujoeyA5YoQizv_QnV_AQWHERWn07bu7hXGBtHbb8oFIW329I0ho6BHsqpCTXqm135ZlpJx6-HVF1iyovS6WWu25kgrdteRo7rzn094dNJI77cy6IkoD8vJhY7OkPGNcqEG4J-vArZEKX',
    altText: 'Class IV veterinary laser therapy equipment in use'
  },
  {
    id: 'g6',
    title: 'Happy Patient After Successful Session',
    category: 'Patients',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPoZf2CwMiVbD20ZjvovNm-SgBAJ47VDImwZYUHbaGfZiZbs4AadQkvU4vaI5CS4k8TLMugZpjxeGXtsAtcMra01a9l14GoJijohU6T2ZnS0ZO2yEeYJxHNY7ZO0tQKMpOyfTJQHLnsmCcMop8L1Fy41LuCiWFIr0RTnHgp77l3IYQIEF7j1ExBr2GsDRrmAGrT8_k-fApNdnOJptGwWK3PlGnQEbG_BZI96oOGBBOU8-rWJCt2GLS',
    altText: 'Happy dog smiling after a relaxing therapy session'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq1',
    category: 'General',
    question: 'Do I need a referral from my regular vet?',
    answer: 'Yes, in most cases we require a referral from your primary care veterinarian to ensure we have your pet\'s complete medical history, surgical reports, X-rays, and can coordinate their care safely and effectively.'
  },
  {
    id: 'faq2',
    category: 'Sessions',
    question: 'How long is a typical rehabilitation session?',
    answer: 'Initial comprehensive assessments take 60 minutes. Follow-up treatment sessions typically last between 30 to 45 minutes, depending on your pet\'s specific needs, condition, and stamina.'
  },
  {
    id: 'faq3',
    category: 'General',
    question: 'Can I stay with my pet during treatment?',
    answer: 'Absolutely! We strongly encourage owners to be present during sessions. It keeps your pet calm and comfortable, and allows us to teach you gentle home care and massage techniques.'
  },
  {
    id: 'faq4',
    category: 'Insurance',
    question: 'Does pet insurance cover physiotherapy?',
    answer: 'Many comprehensive pet insurance policies (such as Trupanion, Nationwide, Healthy Paws, and Petplan) cover veterinary rehabilitation and hydrotherapy when prescribed by a veterinarian. We provide itemized receipts for easy reimbursement.'
  },
  {
    id: 'faq5',
    category: 'Sessions',
    question: 'How many sessions will my pet need?',
    answer: 'Every case is unique. Post-surgical patients usually benefit from a 6 to 8-week block (1-2 times weekly), while chronic conditions like arthritis often shift into bi-weekly or monthly maintenance once stabilized.'
  },
  {
    id: 'faq6',
    category: 'General',
    question: 'What if my dog is nervous around water?',
    answer: 'Our underwater treadmill is filled slowly from the bottom after your pet is already calmly positioned inside with a dedicated hydrotherapist by their side. Water temperature is kept at a soothing 29-31°C (84-88°F), and treats/praise are used throughout.'
  }
];
