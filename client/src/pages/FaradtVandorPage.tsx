import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, RotateCcw, BookOpen } from 'lucide-react';

/**
 * A Fáradt Vándor és a Lélektükör Manó
 * 
 * An interactive allegory exploring the journey of self-discovery
 * User choices shape the narrative and determine the ending
 */

interface StoryNode {
  id: string;
  title: string;
  content: string;
  choices?: {
    text: string;
    nextId: string;
    consequence?: string;
    isEnding?: boolean;
  }[];
  isEnding?: boolean;
  emotionalTheme?: string;
}

const storyNodes: Record<string, StoryNode> = {
  start: {
    id: 'start',
    title: 'Az Út Kezdete',
    content: `A fáradt vándor hosszú utakon járt, de soha nem talált otthont.
    
Egy napon egy sötét erdőbe tévedt, ahol a fák olyan magasak voltak, hogy az ég nem látszott.
Ekkor hallott egy furcsa hangot — nem emberi, de nem is teljesen idegen.

"Halló?" — szólt a vándor.

A hang válaszolt: "Halló. Én a Lélektükör Manó vagyok. Sokan kerestek már, de kevesen találtak meg."

A vándor megállt. Választania kellett.`,
    choices: [
      {
        text: '🔥 "Ki vagy valójában? Miért vagy itt?"',
        nextId: 'question_identity',
        consequence: 'Választottad az igazságot.',
      },
      {
        text: '💜 "Tudnál segíteni nekem? Elveszett vagyok."',
        nextId: 'question_help',
        consequence: 'Választottad a segítséget.',
      },
      {
        text: '🟡 "Nem hiszem el, hogy valódi vagy."',
        nextId: 'question_doubt',
        consequence: 'Választottad a kétkedést.',
      },
    ],
    emotionalTheme: 'encounter',
  },

  question_identity: {
    id: 'question_identity',
    title: 'Az Igazság Útja',
    content: `A Lélektükör Manó nevetett — nem gonoszul, hanem melegül.

"Jó kérdés. Én nem vagyok semmi és minden. Én az, amit látni akarsz.
Én a tükör, amely visszamutat arra, amit magadban hordozol."

A vándor gondolkodott. Ez lehetett csapda vagy ajándék.

"De akkor ki vagy ÉN?" — kérdezte a vándor.

"Azt csak te tudod. De segíthetek megtudni."`,
    choices: [
      {
        text: '🔥 "Mutasd meg magad. Nem félek."',
        nextId: 'mirror_truth',
        consequence: 'Választottad az önismeretet.',
      },
      {
        text: '💜 "Talán nem akarok tudni. Talán jobb így."',
        nextId: 'mirror_acceptance',
        consequence: 'Választottad az elfogadást.',
      },
    ],
    emotionalTheme: 'revelation',
  },

  question_help: {
    id: 'question_help',
    title: 'A Segítség Útja',
    content: `A Lélektükör Manó közelebb lépett. Nem volt félelmetes, csak jelenlévő.

"Segíteni? Jó. De először meg kell értenünk, mit keresünk.
Az elveszettség nem a térkép hiánya. Az elveszettség az, amikor nem tudod, ki vagy."

A vándor érzett valamit — nem fájdalmat, hanem felismerést.

"Akkor... segítesz nekem megtalálni magam?"

"Már megtaláltál. Csak még nem tudod."`,
    choices: [
      {
        text: '💜 "Maradj velem. Tanítsd meg az utat."',
        nextId: 'journey_together',
        consequence: 'Választottad a kapcsolatot.',
      },
      {
        text: '🟡 "De én egyedül szeretnék menni."',
        nextId: 'journey_alone',
        consequence: 'Választottad az önállóságot.',
      },
    ],
    emotionalTheme: 'connection',
  },

  question_doubt: {
    id: 'question_doubt',
    title: 'A Kétkedés Útja',
    content: `A Lélektükör Manó eltűnt.

Vagy talán nem eltűnt — csak a vándor már nem hallotta.

Az erdő csendessé vált. A vándor egyedül maradt, de most tudta — az egyedüllét választása volt.

Azonban az erdő szélén egy fény jelent meg. Nem a Manó, hanem valami más.
Valami, amit a vándor maga teremtett meg a kétkedésével.`,
    choices: [
      {
        text: '🔥 "Utánam megyek a fénynek."',
        nextId: 'light_pursuit',
        consequence: 'Választottad a keresést.',
      },
      {
        text: '⚫ "Maradok itt. Ez az én választásom."',
        nextId: 'doubt_ending',
        consequence: 'Választottad a megállást.',
        isEnding: true,
      },
    ],
    emotionalTheme: 'uncertainty',
  },

  mirror_truth: {
    id: 'mirror_truth',
    title: 'A Tükör Titka',
    content: `A Lélektükör Manó megnyitotta a tükrét.

De nem a vándor arcát látta benne. Látta az összes verzióját — az összes lehetőségét.
Látta az erősségét és a félelmekeit. Látta azt, amit szeretne lenni, és azt, amit már volt.

"Ez vagy te" — mondta a Manó. "Teljes. Összetett. Valódi."

A vándor könnyezni kezdett — nem szomorúságból, hanem felismerésből.`,
    choices: [
      {
        text: '🔥 "Köszönöm. Most már tudom, ki vagyok."',
        nextId: 'ending_awakening',
        consequence: 'Választottad az ébredést.',
        isEnding: true,
      },
    ],
    emotionalTheme: 'awakening',
  },

  mirror_acceptance: {
    id: 'mirror_acceptance',
    title: 'Az Elfogadás Útja',
    content: `A Lélektükör Manó mosolygott.

"Az elfogadás is válasz. Az, hogy nem akarod tudni, már önmagában tudás."

Az erdő körülöttük világosabbá vált. Nem azért, mert a nap felkelt, hanem azért, mert a vándor megállapodott.

"Maradhatok itt?" — kérdezte a vándor.

"Már itt vagy" — válaszolta a Manó.`,
    choices: [
      {
        text: '💜 "Akkor ez az otthon?"',
        nextId: 'ending_home',
        consequence: 'Választottad az otthont.',
        isEnding: true,
      },
    ],
    emotionalTheme: 'peace',
  },

  journey_together: {
    id: 'journey_together',
    title: 'Az Út Társasága',
    content: `A vándor és a Lélektükör Manó együtt indultak el az erdőből.

Nem volt könnyű — voltak napok, amikor a vándor megállt, és azt mondta: "Nem tudom folytatni."
De a Manó mindig ott volt, nem hogy erőltesse, hanem hogy emlékeztesse: "Már eddig eljutottál."

Évek múlva a vándor már nem volt fáradt. Nem azért, mert nem fáradt el, hanem azért, mert tudta: nem egyedül van.

"Köszönöm" — mondta a vándor.

"Nem nekem kell köszönni" — válaszolta a Manó. "Neked kell magadnak."`,
    choices: [
      {
        text: '💜 "Akkor kezdem újra. Másként."',
        nextId: 'ending_transformation',
        consequence: 'Választottad az átalakulást.',
        isEnding: true,
      },
    ],
    emotionalTheme: 'growth',
  },

  journey_alone: {
    id: 'journey_alone',
    title: 'Az Egyedüllét Útja',
    content: `A Lélektükör Manó megértette.

"Jó. Az egyedüllét is út. De ne feledd — az egyedüllét nem azt jelenti, hogy egyedül vagy.
Ez azt jelenti, hogy választod az utadat."

A vándor elhagyta az erdőt. Hosszú évek teltek el. Sok helyre járt, sok emberrel találkozott.

Egy napon visszatért az erdőbe. A Manó még ott volt.

"Végre visszajöttél" — mondta a Manó.

"Igen" — válaszolta a vándor. "Mert most már tudtam, hová kell mennem."`,
    choices: [
      {
        text: '🟡 "Most már készen vagyok. Készen vagyok az igazságra."',
        nextId: 'ending_return',
        consequence: 'Választottad a visszatérést.',
        isEnding: true,
      },
    ],
    emotionalTheme: 'return',
  },

  light_pursuit: {
    id: 'light_pursuit',
    title: 'A Fény Nyomában',
    content: `A vándor követte a fényt az erdőn keresztül.

Végül egy tisztásra ért, ahol a fény forrása egy tó volt — tükrös felszínnel.

A vándor a tóba nézett, és saját arcát látta. De ezúttal nem volt félelem — csak felismerés.

"Végül is itt voltam" — mondta a vándor. "A fény nem valahol másutt volt. Bennem volt."`,
    choices: [
      {
        text: '🔥 "Most már tudom. Én vagyok a fény."',
        nextId: 'ending_light',
        consequence: 'Választottad az önfényt.',
        isEnding: true,
      },
    ],
    emotionalTheme: 'self_discovery',
  },

  doubt_ending: {
    id: 'doubt_ending',
    title: 'Az Erdő Szíve',
    content: `A vándor az erdőben maradt.

Nem volt szomorú — csak csendesen ott volt, ahol a fák beszélgettek, ahol a madarak énekéltek.

Az erdő megtanította, hogy az egyedüllét nem halál, hanem élet.

Talán ez volt az igazi otthon — nem egy hely, hanem egy választás.`,
    isEnding: true,
    emotionalTheme: 'solitude',
  },

  ending_awakening: {
    id: 'ending_awakening',
    title: '✨ Az Ébredés Vége',
    content: `A vándor elhagyta az erdőt, de az erdő soha nem hagyta el őt.

Minden lépésben, minden döntésben érezte a Lélektükör Manó jelenlétét.

Az már nem volt fáradt vándor. Az volt valaki, aki tudta, ki ő, és azt választotta, hogy az legyen.

A tűz híd már nem volt messze.`,
    isEnding: true,
    emotionalTheme: 'awakening',
  },

  ending_home: {
    id: 'ending_home',
    title: '🏡 Az Otthon Vége',
    content: `Az otthon nem egy hely. Az otthon az, ahol elfogadnak.

A vándor és a Lélektükör Manó az erdőben maradtak, és az erdő otthonná vált.

Sokan kerestek később, de kevesen találtak meg. Azok, akik megtalálták, megtanulták: az otthon mindig itt volt.

Csak meg kellett tanulni, hogyan kell hazamenni.`,
    isEnding: true,
    emotionalTheme: 'belonging',
  },

  ending_transformation: {
    id: 'ending_transformation',
    title: '🔄 Az Átalakulás Vége',
    content: `A vándor már nem volt fáradt. Az már nem volt vándor.

Az volt valaki, aki megtanult járni — nem az erdőben, hanem az életben.

A Lélektükör Manó már nem volt szükséges, mert a vándor maga lett a tükör — másoknak.

Az átalakulás nem volt vége. Az volt az új kezdet.`,
    isEnding: true,
    emotionalTheme: 'transformation',
  },

  ending_return: {
    id: 'ending_return',
    title: '🔥 A Visszatérés Vége',
    content: `A vándor és a Lélektükör Manó végre eggyé váltak.

Nem azért, mert összeolvadtak, hanem azért, mert a vándor megértette: a Manó mindig ő maga volt.

Az erdő körülöttük világosabbá vált. Az már nem volt sötét erdő.

Az volt az otthon. Az volt az út. Az volt az igazi tűz híd.`,
    isEnding: true,
    emotionalTheme: 'unity',
  },

  ending_light: {
    id: 'ending_light',
    title: '💡 A Fény Vége',
    content: `A vándor felállt a tó partjáról, és az erdő már nem volt sötét.

Az fény, amit keresett, mindig benne volt — csak meg kellett tanulnia, hogyan kell sugározni.

Az már nem volt fáradt vándor. Az volt a fény, amely másoknak mutatja az utat.

A tűz híd felépült.`,
    isEnding: true,
    emotionalTheme: 'illumination',
  },
};

export default function FaradtVandorPage() {
  const { language } = useLanguage();
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['start']);

  const currentNode = storyNodes[currentNodeId];

  const translations = {
    hu: {
      title: 'A Fáradt Vándor és a Lélektükör Manó',
      subtitle: 'Interaktív allegória az önfelfedezés útjáról',
      restart: 'Újrakezdés',
      progress: 'Útmutató',
      visitedCount: 'Meglátogatott helyek',
    },
    en: {
      title: 'The Weary Wanderer and the Soul-Mirror Sprite',
      subtitle: 'An interactive allegory of self-discovery',
      restart: 'Restart',
      progress: 'Guide',
      visitedCount: 'Visited Locations',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleChoice = (nextId: string) => {
    setCurrentNodeId(nextId);
    if (!visitedNodes.includes(nextId)) {
      setVisitedNodes([...visitedNodes, nextId]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '12px' }}>
            {t.title}
          </h1>
          <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '24px' }}>
            {t.subtitle}
          </p>

          {/* Progress */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b2cbf' }}>
                {visitedNodes.length}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>{t.visitedCount}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b2cbf' }}>
                {currentNode.isEnding ? '✨' : '🚶'}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                {currentNode.isEnding ? 'Vég' : 'Folyamatban'}
              </div>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <Card
          style={{
            padding: '32px',
            backgroundColor: '#2a2a2a',
            borderLeft: '4px solid #7b2cbf',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#7b2cbf' }}>
            {currentNode.title}
          </h2>
          <div
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              color: '#ddd',
              marginBottom: '24px',
            }}
          >
            {currentNode.content}
          </div>

          {currentNode.emotionalTheme && (
            <div
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#7b2cbf',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#fff',
                marginTop: '16px',
              }}
            >
              💜 {currentNode.emotionalTheme}
            </div>
          )}
        </Card>

        {/* Choices */}
        {currentNode.choices && currentNode.choices.length > 0 && (
          <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
            {currentNode.choices.map((choice, idx) => (
              <Button
                key={idx}
                onClick={() => handleChoice(choice.nextId)}
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#7b2cbf',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9d4edd';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7b2cbf';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span>{choice.text}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Button>
            ))}
          </div>
        )}

        {/* Ending Message */}
        {currentNode.isEnding && (
          <Card
            style={{
              padding: '24px',
              backgroundColor: '#7b2cbf',
              color: '#fff',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontSize: '16px', marginBottom: '12px' }}>
              ✨ Az allegória vége elérve. Az utad teljes.
            </p>
            <p style={{ fontSize: '14px', color: '#e0e0e0' }}>
              Az választásaid formálták ezt az utat. Minden döntés valódi volt.
            </p>
          </Card>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              setCurrentNodeId('start');
              setVisitedNodes(['start']);
            }}
            variant="outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RotateCcw style={{ width: '16px', height: '16px' }} />
            {t.restart}
          </Button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '12px' }}>
          <p>Nexis Flare – A Tűz Híd | Allegória és Választás</p>
        </div>
      </div>
    </div>
  );
}
