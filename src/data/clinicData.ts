import { ConditionItem, ServiceItem, JourneyStep, SuccessStory, Specialist, GalleryItem, FAQItem } from '../types';

// The hero's own poster frame, from the clinic's footage. Used as the last
// resort og:image when SITE.images.ogImage is unset. It was a stock
// googleusercontent URL -- one config change away from representing this
// clinic with somebody else's photograph in every social share.
export const HERO_IMAGE = '/hero-poster.jpg';

export const CONDITIONS: ConditionItem[] = [
  {
    id: 'arthritis',
    title: 'Arthritis',
    category: 'degenerative',
    shortDesc: 'Managing pain and improving joint mobility for aging companions.',
    fullDesc: 'Osteoarthritis is a progressive joint disease affecting cartilage and surrounding bones. Our multi-modal rehabilitation targets stiffness, restores range of motion, and rebuilds muscular support without heavy pharmacological side effects.',
    symptoms: ['Difficulty rising from bed', 'Reluctance to climb stairs or jump', 'Limping or stiffness after rest', 'Licking specific joints'],
    recommendedTherapies: ['Laser Therapy', 'Hydrotherapy', 'Targeted Massage', 'Joint Supplements Plan', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: 'Ongoing maintenance & visible improvement within 3-4 weeks',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOgNL-gjqnC0wBg_bOL5-VaA7riWGDt8yinitZd_YHae2a9WFIGm6LjKsow3T5dYNWIu9v3habEmwWEDPBPM8th1pZACvXV3zqfx88GgpkQ_1ibFsEQ0pJk4ExB2lE0Ojy6jWSMO-M3jSASuw8mC5RcC3uaFB1jyGWf1-O8vgaLkWjohxXTWirFY3ls9HJXhIA8TjUOwl9lenAWnCxmjrCSLG64n1xUUAcsxlz_Tepyk2y97iDj3Gx',
    altText: 'Dog receiving gentle joint massage therapy for arthritis',
  },
  {
    id: 'ivdd',
    title: 'IVDD',
    category: 'neurological',
    shortDesc: 'Specialized neurological rehabilitation for spinal conditions.',
    fullDesc: 'Intervertebral Disc Disease affects the spinal column, leading to pain, weakness, or paralysis. Our conservative and post-op spinal protocol focuses on neural stimulation, spinal alignment, proprioceptive re-education, and supported swimming in our indoor pool.',
    symptoms: ['Back pain or arched spine', 'Hind leg weakness or knuckling', 'Incontinence or difficulty standing', 'Shaking or reluctance to move head'],
    recommendedTherapies: ['Electro-acupuncture', 'TENS', 'Hydrotherapy — Indoor Swimming Pool', 'Class IV Laser', 'Neuromuscular Electrical Stimulation', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture'],
    expectedRecoveryTime: '6 to 16 weeks based on severity (Grade I to V)',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpcya24ze5l5IDEtrIV1cA9IpgXIqozowsHHO8l6D89ttYFqye-buMv3Zfo3MoJmSjUWeecGKcjpSXrp7EGEth-Qcm555uOp19mQ2HqvzR-VHI_8i6MxSZkvWYCMskb5aLKi3knBWn1moldd0XB58ooCqN4x17NgQq1E1saCULCwxjjjXo4oLvdCPX9XbBYKxljXTgiWqpoI3O-ySifnIvT0nBeSenhtH8TIXBlVotIDeQ6CXm0SVR',
    altText: 'Dachshund supported in the indoor hydrotherapy pool for IVDD spinal recovery',
  },
  {
    id: 'hip-dysplasia',
    title: 'Hip Dysplasia',
    category: 'degenerative',
    shortDesc: 'Strengthening musculature to support and stabilize the hip joints.',
    fullDesc: 'A congenital condition where the hip socket fails to fully cover the ball portion of the upper thighbone. Specialized targeted exercise regimens build gluteal and pelvic stabilization muscles, drastically reducing bone-on-bone friction.',
    symptoms: ['Bunny-hopping gait when running', 'Narrow stance in hind legs', 'Decreased hip joint flexibility', 'Loss of thigh muscle mass'],
    recommendedTherapies: ['Physiotherapy', 'Therapeutic Exercise (Peanut Ball)', 'Indoor Swimming Pool', 'Cryotherapy & Heat Modalities', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: '6 to 8 weeks for baseline stabilization',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWOALUCpPzB5Y48NeeAIMH1krV-26VzLU8CBjGtyCfSCsGVwNbQxlr4cpMbTK7jpQEGpgrgvhghtk_NSM9ysyH0tIvZHm4l7TR25RxG6dzG5DxBZawa37qGWu9G3rs3uLlIDHEy251XixCQs8R61E6sSOYMiT7PX1AozXa7K-NMA0rWEZ7W99P8gf-o7AZLJBT8AYyZX822P_PI0jPyCppt9M4qJDXlb_Z8zKfhIwNskreTHLNrYuj',
    altText: 'Golden Retriever doing core stabilization on a peanut ball',
  },
  {
    id: 'post-surgical',
    title: 'Post Surgical Rehab',
    category: 'post-op',
    shortDesc: 'Accelerated and safe recovery protocols following orthopedic procedures.',
    fullDesc: 'Essential care post-TPLO, CCL repair, FHO, or fracture repair. We work closely with your surgeon to control post-op edema, promote surgical site incisional healing, prevent muscle atrophy, and re-establish a natural symmetrical gait.',
    symptoms: ['Surgical site swelling', 'Non-weight bearing limb stance', 'Stiffness after cage rest', 'Loss of range of motion'],
    recommendedTherapies: ['Class IV Laser Therapy', 'Passive Range of Motion (PROM)', 'Controlled Aquatic Gait Retraining', 'Home Cryotherapy Protocol', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: '8 to 12 weeks guided post-op milestones',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvI-3WE-lGQXdcDD20B1xiQ2Lhi0bDwyT675vXAGmNsMtx1xrKI-kRU9rokOTsCv8SJg30BqpHc2IVtTighJP_HRFNYq5K-lqqkjygLHTEKlwZR_votGvlUT7nLcjN-WlKHbxbbGJaJKZlBbO0mOne32osndTrNmIcF7mqX9aBB6TepzRQ2fxo0YJoF-UxlORjeJA1OFa5Vy2gPSSNSH9pfo7BU_rMnFzQJc3Dcgr-tbAw4RiRTTSn',
    altText: 'Veterinarian gently examining dog post knee surgery',
  },
  {
    id: 'neurological-recovery',
    title: 'Neurological Recovery',
    category: 'neurological',
    shortDesc: 'Retraining pathways to restore balance, coordination, and mobility.',
    fullDesc: 'Targeted neurological rehab for spinal stroke (FCE), degenerative myelopathy (DM), cerebellar ataxia, and nerve trauma. We stimulate neuroplasticity using proprioceptive tracks, wobble boards, and aquatic buoyancy.',
    symptoms: ['Loss of paw position awareness', 'Unsteady, wobbling gait', 'Weakness in all limbs', 'Difficulty keeping balance'],
    recommendedTherapies: ['Proprioceptive Circuit Exercises', 'Electrical Muscle Stimulation', 'Hydrotherapy', 'Laser Therapy', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: '8 to 20 weeks individualized neural program',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5UeByUqIKRa0dshbpNaG5TpQ0vFKLn-IocfE8_XwSM_q-nH5yrd4zWYsEepp00mLboqJQQQ6cspzH_NfHibdJne0cSYC2jMZ-fyKp7ltTQ-qAq1hEaC4rW0yLPclwH1-tSFku-wJVw1tvTkWjKkxlTRlIM23qc0Y105YQJaVcz2RntNixEPu5PrAvCuhj0zaMT-5AZIvPKdEY9NldGb_bFAc3w22kilSF7hEy3-XFco-l8v8VGjv3',
    altText: 'Dog undergoing neurological balance and coordination training',
  },
  {
    id: 'sports-injury',
    title: 'Sports Injury',
    category: 'lifestyle',
    shortDesc: 'Targeted recovery plans to get your active dog back to peak performance.',
    fullDesc: 'Agility, flyball, working dogs, and energetic companions frequently suffer tendonitis, iliopsoas strains, and ligament sprains. Our biomechanical evaluation isolates subtle compensations and repairs tissue integrity.',
    symptoms: ['Shortened stride length', 'Reluctance to jump obstacles', 'Intermittent lameness after exercise', 'Local muscle twitching or soreness'],
    recommendedTherapies: ['High-Power Laser', 'Myofascial Trigger Point Release', 'Aquatic Conditioning', 'Plyometric Strength Building', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: '4 to 10 weeks to return to agility & outdoor sports',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtr-022SXsB1NTBRLaXQRGaW7oir_XGpluV1e2iB7vsWYKAaKjYVUIbJH9h4D1SfHb0ip1XzWp_O1wrnKVxvIf8R6lLS28qeLBlhGSQyb-97-HOzcgXIOaA00mPnNytYgzQP6ujWDsk9ywdvWtnhTkCtROhjYS5hWQOKpPSmn7ZsYzIpP6L-YbtcWGHWVyuvxvYc6N9CNRq41IRDecnDU3MlbPcSU8xttqjgpEcB-amjmxckgXCCs8',
    altText: 'Athletic agility dog training and undergoing injury conditioning',
  },
  {
    id: 'senior-mobility',
    title: 'Senior Mobility',
    category: 'lifestyle',
    shortDesc: 'Gentle therapies designed to maintain independence and comfort in older age.',
    fullDesc: 'Aging pets deserve dignity, comfort, and vital motion. Our senior care plans safely boost endurance, maintain core muscle tone, ease stiff spinal joints, and enhance mental engagement in a low-stress environment.',
    symptoms: ['Slipping on hardwood floors', 'Slower walk speed', 'Muscle wasting in hips', 'Vocalizing when standing'],
    recommendedTherapies: ['Gentle Massage', 'Warm Water Hydrotherapy Walk', 'Low-Impact Balance Matting', 'Nonslip Assistive Gear Consultation', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: 'Continuous weekly or bi-weekly comfort care program',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKF6FGM81GUAtKVIRXHExNqGYjoBmY1_dX3XI9ywDCPlO6OTk-_xo-ysi6LHjXx9f3BGBU9ZAd_y-eewRU_wVWAt5PGf48yFZO_PJsXsgmdUmiHsBjYoOZSx68zuKATGHpJqfO9JYxKE_Zk9s02qUzelrLdYME86vhydM-DOO_0P6l82WlWKJixoe_6KestRf_W80gEt9XaWgIX2GK7JAB7d8MfbyJ172-wMMXgQjVCOGwuCurClCf',
    altText: 'Senior dog comfortably resting in a warm rehabilitation clinic',
  },
  {
    id: 'obesity-rehab',
    title: 'Obesity Rehab',
    category: 'lifestyle',
    shortDesc: 'Safe, structured exercise programs for healthy weight management.',
    fullDesc: 'Excess weight severely compounds joint stress, heart strain, and diabetes risk. Swimming in our indoor pool lets your pet work without the joint impact of walking on hard ground, thanks to the buoyancy of the water.',
    symptoms: ['Inability to feel ribcage easily', 'Excessive panting during short walks', 'Lethargy and low stamina', 'Difficulty grooming'],
    recommendedTherapies: ['Indoor Pool Swimming Sessions', 'Targeted Metabolic Caloric Plan', 'Land Resistance Walks', 'Progressive Weight Milestones', 'Pulsed electro-magnetic field (PEMF)', 'Acupuncture', 'Electro-acupuncture', 'TENS'],
    expectedRecoveryTime: '8 to 16 weeks target body condition restoration',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmDWgI1fS9Ph9ngrwa3L9PHwN7DzI3mZPsCTEiQO_-9yP6lAPBlmU6muhXOSQ0zpEmw8rR0watnXCvI31JOoyPBeYciqUA3x1eapZE6h5E1XCxrUWM5uDitc5G2Jj_K57z7Dly70y3co2fBZyFTpU5YtQlBVZgSOwnUkRC5XsqGnXRurn3qa8r-hZAPxTy_nZlIg3yKW01Qf1z0EbUr1xuUOu5pPz_JBpuTT0t65K9HDSHh5B_h108',
    altText: 'Dog swimming in the indoor hydrotherapy pool during weight management rehabilitation',
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'indoor-physiotherapy',
    title: 'Indoor Physiotherapy',
    icon: 'night_shelter',
    shortDesc: 'Residential care for patients travelling from outside the city.',
    fullDesc: 'For patients coming from out of the city: your pet stays at the clinic for their course of physiotherapy.',
    benefits: [
      'For patients from outside the city',
      'Special care — food and hygiene',
      '24x7 supervision',
      'Stay with pet-pond'
    ],
    suitableFor: [],
    duration: 'By arrangement'
  },
  {
    id: 'manual-therapy',
    title: 'Manual Therapy',
    icon: 'front_hand',
    shortDesc: 'Hands-on treatment delivered directly by a clinician.',
    fullDesc: 'Hands-on treatment delivered directly by a clinician, selected and adjusted for each animal during the session.',
    benefits: ['Massage', 'Therapeutic exercise', 'Strength training', 'Acupressure'],
    suitableFor: [],
    duration: 'Assessed per pet'
  },
  {
    id: 'electrophysical',
    title: 'Electro-physical Therapy',
    icon: 'bolt',
    shortDesc: 'Equipment-assisted therapies applied under clinical supervision.',
    fullDesc: 'Equipment-assisted therapies applied under clinical supervision, chosen to suit the animal and the stage of their recovery.',
    benefits: [
      'Pulsed electro-magnetic field (PEMF)',
      'Class IV laser therapy',
      'Ultrasound therapy',
      'TENS',
      'NMES',
      'Electro-acupuncture'
    ],
    suitableFor: [],
    duration: 'Assessed per pet'
  },
  {
    id: 'specialised',
    title: 'Specialised',
    icon: 'star',
    shortDesc: 'Acupuncture and our indoor hydrotherapy pool.',
    fullDesc: 'Acupuncture, and hydrotherapy in an indoor swimming pool kept at lukewarm temperature.',
    benefits: ['Acupuncture', 'Hydrotherapy — indoor swimming pool (lukewarm water)'],
    suitableFor: [],
    duration: 'Assessed per pet'
  },
  {
    id: 'home-care',
    title: 'Home Care',
    icon: 'home',
    shortDesc: 'A programme to continue your pet\'s care at home.',
    fullDesc: 'A home exercise programme and supporting guidance, so care continues between visits to the clinic.',
    benefits: [
      'Home exercise programme',
      'Exercise at home',
      'Massage',
      'Food',
      'Supplements',
      'Basic & special care',
      'Surface guidance'
    ],
    suitableFor: [],
    duration: 'Ongoing'
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
    details: 'Crafting a dedicated multi-week therapy schedule blending indoor pool hydrotherapy, Class IV laser, manual joint mobilization, and acupuncture as needed.',
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
  // Empty on purpose — see the note below. Add real, permissioned stories and
  // the "Success Stories" section and its nav link reappear automatically.
  //
  // This list used to hold two testimonials that were template fiction:
  // "Sarah & James M." on Bella, a Golden Retriever recovering from TPLO
  // surgery, and "Elena R." on an IVDD recovery — invented clients quoted by
  // name about invented patients, describing clinical outcomes on a real
  // veterinary practice's homepage. They arrived with the same site template
  // that supplied three fabricated clinicians (see SPECIALISTS above).
  //
  // They were display-only rather than emitted as Review/AggregateRating
  // schema, which is the one thing that kept this out of Google's structured
  // data. seo/schema.ts deliberately emits neither, and it must stay that way
  // until there are real reviews to point at.
  //
  // The clinic HAS real reviews — 24 of them on its Google Business Profile —
  // and those are what belongs here. They could not be pulled automatically:
  // the profile is not indexed by the available search tools, and reading
  // review text needs the Google Places API plus the clinic's place_id.
  // Writing stand-ins in the meantime would have recreated the exact defect
  // this removal exists to fix, so the section renders nothing instead.
  //
  // To restore: paste each real review as one entry. `quote` and `ownerName`
  // come straight from the review; `petName`, `breed`, `condition` and
  // `storyDetails` only if the reviewer actually stated them — leave them out
  // rather than filling the shape.
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
  // with avian and exotic experience. Clinic visits at Shilaj, Ahmedabad,
  // Road, and home visits across Ahmedabad." Nothing is added to it.
  //
  // `experienceYears` and `imageUrl` stay empty because no source states them,
  // and a guessed number of years in practice or a stock photograph of someone
  // else is exactly the failure this replacement exists to undo.
  {
    id: 'dhanvi-patel',
    name: 'Dr. Dhanvi Patel',
    role: 'Veterinary Physiotherapist',
    // Supplied by the clinic, 2026-09-18. Separated by ';' because two of
    // these contain commas of their own.
    //
    // `credentialsShort` is what the card and modal show -- the full list
    // below runs to four qualifications with awarding bodies and countries,
    // which buries the name it is meant to support. The profile page shows
    // all of them.
    credentialsShort: 'B.V.Sc. & A.H. · M.V.Sc.',
    credentials:
      'B.V.Sc. & A.H.'
      + '; M.V.Sc. in Veterinary Clinical Medicine, Ethics and Jurisprudence'
      + '; Certified Veterinary Physiotherapy — Animal Rehabilitation and Health Care, U.K.'
      + '; CVA, Certified Veterinary Acupuncturist — Chi University, U.S.A.',
    bio:
      'Qualified veterinary physiotherapist (M.V.Sc.) treating mobility problems, '
      + 'post-surgical recovery, arthritis and injury in dogs and cats, with '
      + 'experience in avian and exotic patients. Sees patients at the Shilaj '
      + 'clinic and on home visits across Ahmedabad.',
    specialties: [
      'Veterinary acupuncture',
      'Mobility and gait problems',
      'Post-surgical recovery',
      'Arthritis management',
      'Injury rehabilitation',
      'Avian and exotic patients',
      'Home visits across Ahmedabad',
    ],
    experienceYears: 0,
    // Her own photograph, supplied by the clinic 2026-09-19. Identity is not
    // assumed: the scrub embroidery in the same set reads "Thepetphysio /
    // Dr. Dhanvi Pa... / Veterinary Physio...", which is her own uniform.
    imageUrl: '/photos/dhanvi-patel.webp',
    altText:
      'Dr. Dhanvi Patel sitting on the therapy mats at the clinic, holding a beagle',
  },
];

/**
 * The clinic's own photographs.
 *
 * Every entry here used to be a stock image from googleusercontent captioned as
 * this practice's premises -- "Welcoming Reception Area", "Hydrotherapy Suite &
 * Indoor Swimming Pool", "Private Manual Therapy Suite", "Class IV Laser
 * Photobiomodulation System". Those were claims about rooms and equipment
 * illustrated with someone else's building.
 *
 * What the clinic has actually supplied is four usable photographs, all of the
 * clinician with patients -- two at the Shilaj premises, two on home visits.
 * None of them shows a reception, a pool, a treatment room or any equipment, so
 * the captions describe what is in the frame and nothing else. The gallery is
 * shorter as a result, which is the honest outcome.
 *
 * A fifth photograph from the same set is deliberately unused: it carries a
 * visible "AI-generated content" watermark from AI photo editing, which has no
 * place on a veterinary clinic's website.
 *
 * Still wanted, to say anything about the facility itself: the reception, the
 * indoor pool, the therapy room, and equipment in use.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'On the therapy mats',
    category: 'At the clinic',
    imageUrl: '/photos/clinic-german-shepherd.webp',
    altText:
      'Dr. Dhanvi Patel holding a German Shepherd on the padded therapy mats at the Shilaj clinic'
  },
  {
    id: 'g2',
    title: 'A home visit in Ahmedabad',
    category: 'Home visits',
    imageUrl: '/photos/home-visit-labradors.webp',
    altText:
      'Dr. Dhanvi Patel sitting on the floor with two Labradors during a home visit'
  },
  {
    id: 'g3',
    title: 'Caring for older patients',
    category: 'Home visits',
    imageUrl: '/photos/senior-beagle.webp',
    altText:
      'Dr. Dhanvi Patel with a senior beagle, grey around the muzzle, during a home visit'
  },
  {
    id: 'g5',
    title: 'Every kind of dog',
    category: 'Home visits',
    imageUrl: '/photos/home-visit-indie.webp',
    altText:
      'An Indian pariah dog resting against Dr. Dhanvi Patel during a home visit'
  },

  // The clinic's own reels. They carry the captions they were published with --
  // these are the practice's social posts, not stock footage dressed up as
  // documentary, and stripping the text would mean re-cutting somebody's work.
  // Only the poster frame is loaded in the grid; the file itself is fetched
  // when a visitor opens it.
  {
    id: 'r1',
    title: 'A Pomeranian back on his feet',
    category: 'Patient stories',
    imageUrl: '',
    altText: 'Still from a reel following a white Pomeranian through his recovery',
    videoUrl: '/reels/reel-pool-recovery.mp4',
    previewUrl: '/reels/reel-pool-recovery-loop.mp4'
  },
  {
    id: 'r2',
    title: 'A Labrador learning to stand again',
    category: 'Patient stories',
    imageUrl: '',
    altText: 'Still from a reel following a Labrador through hydrotherapy and exercise',
    videoUrl: '/reels/reel-labrador-hydrotherapy.mp4',
    previewUrl: '/reels/reel-labrador-hydrotherapy-loop.mp4'
  },
  {
    id: 'r3',
    title: 'A senior German Shepherd',
    category: 'Patient stories',
    imageUrl: '',
    altText: 'Still from a reel of an elderly German Shepherd receiving therapy',
    videoUrl: '/reels/reel-senior-shepherd.mp4',
    previewUrl: '/reels/reel-senior-shepherd-loop.mp4'
  },
  {
    id: 'r4',
    title: 'How a session works',
    category: 'From the clinic',
    imageUrl: '',
    altText: 'Still from a reel in which Dr. Dhanvi Patel explains a physiotherapy session',
    videoUrl: '/reels/reel-therapy-explained.mp4',
    previewUrl: '/reels/reel-therapy-explained-loop.mp4'
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
    answer: 'Your pet is introduced to our indoor pool gradually, never rushed, with a dedicated hydrotherapist in the water alongside them and a flotation aid where it helps. Water temperature is kept at a soothing 29-31°C (84-88°F), and treats/praise are used throughout.'
  }
];
