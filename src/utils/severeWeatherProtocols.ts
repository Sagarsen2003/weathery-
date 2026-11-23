import type { AlertCategory, AlertSafetyActions, AlertChecklistItem } from '../types/weather';

export interface ProtocolDefinition {
  category: AlertCategory;
  title: string;
  badge: string;
  badgeBg: string;
  borderColor: string;
  safetyActions: AlertSafetyActions;
  checklist: AlertChecklistItem[];
}

export const SEVERE_PROTOCOLS: Record<AlertCategory, ProtocolDefinition> = {
  thunderstorm: {
    category: 'thunderstorm',
    title: 'Severe Thunderstorm & Lightning Protocol',
    badge: 'Severe Warning',
    badgeBg: 'bg-rose-600 text-white',
    borderColor: 'border-rose-500/40',
    safetyActions: {
      immediateSteps: [
        'Move indoors immediately to a substantial building or hard-topped vehicle.',
        'Stay away from windows, glass doors, skylights, and electrical appliances.',
        'Avoid contact with plumbing fixtures (sinks, showers) as metal pipes can conduct lightning.',
        'Unplug sensitive electronics and computers to protect against lightning power surges.',
        'Bring household pets indoors and secure outdoor patio items that could become airborne.',
      ],
      travelAdvice: [
        'Pull over safely away from tall trees and power lines if wind gusts become severe.',
        'Do not drive through standing water or flooded road dips (turn around, don’t drown).',
        'Turn on low-beam headlights and hazard indicators if visibility drops severely.',
      ],
      healthPrecautions: [
        'If outdoors with no shelter: crouch low on the balls of your feet with hands on knees (never lie flat).',
        'Wait at least 30 minutes after the last clap of thunder before heading back outdoors.',
      ],
      dos: [
        'Seek shelter inside an enclosed building or vehicle',
        'Keep mobile phones charged with portable power banks',
        'Monitor local weather radio and app alerts for tornado watches',
        'Report downed power lines immediately to utility authorities',
      ],
      donts: [
        'DO NOT stand under tall isolated trees or open flagpoles',
        'DO NOT use corded phones or take showers during active strikes',
        'DO NOT touch metal fences, bleachers, or metal golf clubs',
        'DO NOT drive through moving water or flooded viaducts',
      ],
      emergencyContacts: [
        { label: 'Emergency Services', number: '112 / 911', description: 'Immediate life danger & rescue' },
        { label: 'Disaster Helpline', number: '1070', description: 'Local civil defense & disaster response' },
        { label: 'Power Utility Emergency', number: '1912', description: 'Report snapped power lines & sparks' },
      ],
    },
    checklist: [
      { id: 'ts-1', label: 'All family members and pets safely indoors' },
      { id: 'ts-2', label: 'Windows, skylights, and balcony doors securely latched' },
      { id: 'ts-3', label: 'Outdoor furniture, trampolines, and trash bins secured' },
      { id: 'ts-4', label: 'Emergency flashlights and portable battery packs ready' },
      { id: 'ts-5', label: 'Major desktop electronics unplugged from wall outlets' },
    ],
  },

  flood: {
    category: 'flood',
    title: 'Flash Flood & Deluge Emergency Protocol',
    badge: 'Flash Flood Alert',
    badgeBg: 'bg-blue-600 text-white',
    borderColor: 'border-blue-500/40',
    safetyActions: {
      immediateSteps: [
        'Immediately move to higher ground or upper floors. Do not wait for instructions.',
        'Disconnect electrical mains and gas supplies if safe to do so before water enters.',
        'Never walk, swim, or drive through flood waters. Just 6 inches of moving water can knock you down.',
        'Keep emergency go-bag, documents, and medications in waterproof bags.',
      ],
      travelAdvice: [
        'Turn Around, Don’t Drown! Most flood fatalities occur in motor vehicles.',
        'If your vehicle stalls in rapidly rising water, abandon it immediately and seek high ground.',
        'Avoid bridges over fast-moving water; riverbeds may be washed out underneath.',
      ],
      healthPrecautions: [
        'Do not drink tap water until verified safe by municipal health authorities (boil notice).',
        'Avoid contact with floodwater as it often contains sewage, harmful bacteria, and sharp debris.',
      ],
      dos: [
        'Move essential valuables and food to upper floors',
        'Keep a battery-powered radio tuned to disaster updates',
        'Have clean bottled drinking water ready (at least 3 gallons/person)',
      ],
      donts: [
        'DO NOT drive past barricades marking flooded streets',
        'DO NOT touch electrical equipment if you are standing in water',
        'DO NOT let children or pets play in stormwater drains',
      ],
      emergencyContacts: [
        { label: 'Emergency Rescue', number: '112 / 911', description: 'Water rescue and evacuation' },
        { label: 'Flood Control Center', number: '1077', description: 'River stage updates and relief camps' },
      ],
    },
    checklist: [
      { id: 'fl-1', label: 'Evacuate to elevated floor or designated high-ground shelter' },
      { id: 'fl-2', label: 'Turn off home main circuit breaker if flood enters ground floor' },
      { id: 'fl-3', label: 'Prepare 3-day supply of sealed bottled water and non-perishables' },
      { id: 'fl-4', label: 'Store vital medications and identification papers in ziplock pouches' },
    ],
  },

  wind: {
    category: 'wind',
    title: 'High Gale & Windstorm Protocol',
    badge: 'Gale Warning',
    badgeBg: 'bg-amber-600 text-white',
    borderColor: 'border-amber-500/40',
    safetyActions: {
      immediateSteps: [
        'Move away from exterior walls and large panoramic glass windows.',
        'Take shelter in an interior hallway, closet, or reinforced ground floor room.',
        'Secure exterior trash containers, outdoor grills, umbrellas, and potted plants.',
        'Park vehicles in garages or away from overhanging tree branches.',
      ],
      travelAdvice: [
        'Avoid driving high-profile vehicles, box trucks, RVs, and towing trailers.',
        'Watch for flying debris, branches, and sudden crosswinds when crossing bridges.',
      ],
      healthPrecautions: [
        'Treat any downed line as energized and lethal. Keep at least 35 feet (10 meters) distance.',
      ],
      dos: [
        'Keep shoes and protective jackets ready if sudden evacuation is needed',
        'Trim dead branches near your roofline before storm seasons',
        'Check in with elderly neighbors who may need assistance securing their home',
      ],
      donts: [
        'DO NOT attempt to repair damaged roof tiles or fences during high winds',
        'DO NOT stand near decaying trees or unreinforced brick chimneys',
      ],
      emergencyContacts: [
        { label: 'Emergency Services', number: '112 / 911', description: 'Structural collapses & entrapment' },
        { label: 'Road Authority Helpline', number: '1033', description: 'Highway closures & debris clearing' },
      ],
    },
    checklist: [
      { id: 'w-1', label: 'All outdoor furniture and loose debris stowed in garage' },
      { id: 'w-2', label: 'Vehicles moved clear of large overhanging trees' },
      { id: 'w-3', label: 'All storm shutters or heavy curtains drawn over windows' },
      { id: 'w-4', label: 'Emergency flashlights tested and batteries confirmed' },
    ],
  },

  heat: {
    category: 'heat',
    title: 'Excessive Heatwave & Heat Stroke Protocol',
    badge: 'Extreme Heat',
    badgeBg: 'bg-rose-700 text-white',
    borderColor: 'border-rose-600/40',
    safetyActions: {
      immediateSteps: [
        'Remain in air-conditioned environments during peak heat hours (11:00 AM – 5:00 PM).',
        'Drink plenty of fluids (water and electrolyte solutions), even before feeling thirsty.',
        'Never, under any circumstance, leave children or pets inside parked vehicles.',
        'Close window blinds and thermal curtains to block direct radiant solar heat.',
      ],
      travelAdvice: [
        'Postpone outdoor physical exertion, running, or heavy construction to early morning or late night.',
        'Carry extra drinking water in vehicles in case of traffic gridlock or highway breakdowns.',
      ],
      healthPrecautions: [
        'Recognize Heat Stroke symptoms: Confusion, dizziness, hot red dry skin, rapid pulse. Call emergency services immediately.',
        'Cool down heat exhaustion victims with wet towels, ice packs under armpits, and fans.',
      ],
      dos: [
        'Wear loose-fitting, lightweight, light-colored cotton clothing',
        'Check on elderly relatives and neighbors at least twice daily',
        'Provide plenty of shaded, fresh water for outdoor animals and pets',
      ],
      donts: [
        'DO NOT drink alcohol or high-sugar energy drinks which accelerate dehydration',
        'DO NOT engage in high-intensity exercise in midday sun',
        'DO NOT leave fans running in closed rooms when temps exceed 38°C without fresh ventilation',
      ],
      emergencyContacts: [
        { label: 'Ambulance / Medical Emergency', number: '108 / 911', description: 'Heat stroke & acute fainting' },
        { label: 'Public Health Hotline', number: '104', description: 'Nearest air-conditioned cooling centers' },
      ],
    },
    checklist: [
      { id: 'h-1', label: 'Bottles of cold water and oral rehydration salts prepared' },
      { id: 'h-2', label: 'Air conditioner / cooling fans checked and set to safe temp' },
      { id: 'h-3', label: 'Blinds and curtains pulled shut on sun-facing windows' },
      { id: 'h-4', label: 'Vulnerable family members or neighbors checked on' },
    ],
  },

  freeze: {
    category: 'freeze',
    title: 'Sub-Zero Arctic Freeze & Blizzard Protocol',
    badge: 'Hard Freeze',
    badgeBg: 'bg-cyan-600 text-white',
    borderColor: 'border-cyan-400/40',
    safetyActions: {
      immediateSteps: [
        'Stay indoors. Minimize travel to prevent getting stranded in subzero wind chills.',
        'Dress in multiple loose, warm layers rather than one heavy layer.',
        'Insulate exposed water pipes and allow faucets to drip slightly to prevent bursting.',
        'Bring outdoor pets indoors immediately; cold wind can cause rapid hypothermia.',
      ],
      travelAdvice: [
        'Keep emergency car winter kit: warm blankets, jumper cables, scraper, sand/traction mat, torch.',
        'Drive slowly with increased braking distance; beware of invisible black ice on bridges.',
      ],
      healthPrecautions: [
        'Watch for frostbite symptoms: white or pale fingers, numbness, tingling. Warm slowly with warm (not hot) water.',
      ],
      dos: [
        'Wear waterproof winter boots, thermal gloves, and head coverings',
        'Keep space heaters at least 3 feet away from bedding and drapes',
        'Test carbon monoxide alarms if using fuel-burning heaters or generators',
      ],
      donts: [
        'DO NOT run fuel generators or charcoal grills inside the home or garage',
        'DO NOT rub frostbitten skin vigorously as it causes tissue damage',
      ],
      emergencyContacts: [
        { label: 'Emergency Rescue', number: '112 / 911', description: 'Hypothermia & stranded motorists' },
        { label: 'Winter Road Information', number: '511', description: 'Highway conditions & snow plows' },
      ],
    },
    checklist: [
      { id: 'fz-1', label: 'Indoor heating systems and carbon monoxide monitors checked' },
      { id: 'fz-2', label: 'Outdoor water faucets shut off and indoor taps on slow drip' },
      { id: 'fz-3', label: 'Pets brought inside with warm bedding' },
      { id: 'fz-4', label: 'Thermal clothing and extra blankets readily accessible' },
    ],
  },

  aqi: {
    category: 'aqi',
    title: 'Hazardous Air Quality & Smog Emergency Protocol',
    badge: 'Hazardous AQI',
    badgeBg: 'bg-purple-800 text-white',
    borderColor: 'border-purple-600/40',
    safetyActions: {
      immediateSteps: [
        'Remain indoors with doors and windows tightly sealed to prevent outdoor particulate ingress.',
        'Run high-efficiency particulate air (HEPA) purifiers on high speed.',
        'Wear a well-fitted N95, KN95, or FFP2 respirator mask if you must go outdoors.',
        'Avoid all strenuous outdoor exercise, jogging, and sports activities.',
      ],
      travelAdvice: [
        'Set vehicle air conditioning to "Recirculation" mode so outside toxic fumes are not pulled in.',
        'Keep car windows completely rolled up in congested traffic or industrial corridors.',
      ],
      healthPrecautions: [
        'Individuals with asthma, bronchitis, or cardiovascular illness must keep rescue inhalers within arm’s reach.',
        'Gargle with warm salt water and rinse eyes if irritation develops from photochemical smog.',
      ],
      dos: [
        'Use moist towels along door thresholds if window seals are leaky',
        'Stay well-hydrated to help your respiratory tract clear fine particulate matter',
        'Consult with your physician if experiencing shortness of breath or chest tightness',
      ],
      donts: [
        'DO NOT burn incense, candles, or wood fireplaces indoors',
        'DO NOT rely on loose cloth or surgical masks (they do not filter PM2.5)',
        'DO NOT vacuum without a HEPA filter (it kicks settled particulates into the air)',
      ],
      emergencyContacts: [
        { label: 'Medical Emergency', number: '108 / 911', description: 'Acute respiratory distress & asthma' },
        { label: 'Air Quality Center', number: '1800-180-1717', description: 'Air pollution advisory & advisories' },
      ],
    },
    checklist: [
      { id: 'aq-1', label: 'All windows and external vents sealed' },
      { id: 'aq-2', label: 'HEPA air purifiers active in main living and sleeping areas' },
      { id: 'aq-3', label: 'Certified N95 / KN95 masks available for essential travel' },
      { id: 'aq-4', label: 'Inhalers and prescribed respiratory medications restocked' },
    ],
  },

  fog: {
    category: 'fog',
    title: 'Dense Fog & Low Visibility Hazard Protocol',
    badge: 'Dense Fog Advisory',
    badgeBg: 'bg-zinc-700 text-white',
    borderColor: 'border-zinc-500/40',
    safetyActions: {
      immediateSteps: [
        'Reduce vehicular speed significantly and increase following distance to at least 5-6 seconds.',
        'Use LOW-BEAM headlights and fog lights only. High beams reflect off moisture droplets, blinding you.',
        'Listen carefully for approaching traffic if crossing junctions or intersections.',
      ],
      travelAdvice: [
        'Follow the white lane line on the right side of the road as a visual guide.',
        'If visibility drops to near zero, pull completely off the roadway onto a safe shoulder and turn on hazard lights.',
      ],
      healthPrecautions: [
        'Moist dense fog can trap particulate matter; wear a mask if you have sensitive lungs.',
      ],
      dos: [
        'Allow extra time for travel and keep defrosters running',
        'Slow down before intersections, roundabouts, and railway crossings',
      ],
      donts: [
        'DO NOT use high-beam headlights in thick fog',
        'DO NOT slam on brakes abruptly on highways; slow down gradually',
      ],
      emergencyContacts: [
        { label: 'Traffic Police Assistance', number: '103 / 911', description: 'Highway accidents and tow trucks' },
      ],
    },
    checklist: [
      { id: 'fog-1', label: 'Vehicle windshield wipers and defrosters tested' },
      { id: 'fog-2', label: 'Low-beam fog lights switched on before departure' },
      { id: 'fog-3', label: 'Travel departure scheduled with extra safety buffer time' },
    ],
  },

  uv: {
    category: 'uv',
    title: 'Extreme UV Radiation Hazard Protocol',
    badge: 'Extreme UV Index',
    badgeBg: 'bg-amber-500 text-slate-950',
    borderColor: 'border-amber-400/40',
    safetyActions: {
      immediateSteps: [
        'Seek shade between 10:00 AM and 4:00 PM when UV rays are at peak intensity.',
        'Apply broad-spectrum SPF 50+ sunscreen liberally 20 minutes before stepping outside.',
        'Wear UV400 sunglasses to protect eyes from cataracts and retinal solar damage.',
        'Wear wide-brimmed hats and tightly woven clothing covering arms and legs.',
      ],
      travelAdvice: [
        'Remember that sand, snow, and water reflect UV radiation, amplifying sun exposure by up to 80%.',
      ],
      healthPrecautions: [
        'Reapply sunscreen every 2 hours, or immediately after swimming or heavy perspiration.',
      ],
      dos: [
        'Check UV forecast index before planning outdoor outings',
        'Keep infants under 6 months completely out of direct midday sunlight',
      ],
      donts: [
        'DO NOT assume cloud cover blocks UV rays; up to 80% of UV penetrates overcast clouds',
        'DO NOT stay in direct sunlight until your skin burns',
      ],
      emergencyContacts: [
        { label: 'Dermatology & Burn Center', number: '102 / 911', description: 'Severe blistering sunburns' },
      ],
    },
    checklist: [
      { id: 'uv-1', label: 'Broad spectrum SPF 50+ sunscreen applied' },
      { id: 'uv-2', label: 'UV400 protective sunglasses and wide-brim hat packed' },
      { id: 'uv-3', label: 'Outdoor tasks scheduled before 10 AM or after 4 PM' },
    ],
  },
};
