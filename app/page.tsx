'use client'

import { useEffect, useMemo, useState } from 'react'

type Station = { id: string; name: string; prefecture: string; region: string; x: number; y: number }
type Visit = { stationId: string; date: string; memo: string }

const stations: Station[] = [
  { id:'sapporo', name:'札幌', prefecture:'北海道', region:'北海道', x:760, y:95 },
  { id:'hakodate', name:'函館', prefecture:'北海道', region:'北海道', x:715, y:155 },
  { id:'aomori', name:'青森', prefecture:'青森県', region:'東北', x:690, y:215 },
  { id:'morioka', name:'盛岡', prefecture:'岩手県', region:'東北', x:710, y:270 },
  { id:'sendai', name:'仙台', prefecture:'宮城県', region:'東北', x:700, y:330 },
  { id:'niigata', name:'新潟', prefecture:'新潟県', region:'中部', x:610, y:335 },
  { id:'tokyo', name:'東京', prefecture:'東京都', region:'関東', x:680, y:420 },
  { id:'yokohama', name:'横浜', prefecture:'神奈川県', region:'関東', x:655, y:455 },
  { id:'nagano', name:'長野', prefecture:'長野県', region:'中部', x:585, y:400 },
  { id:'kanazawa', name:'金沢', prefecture:'石川県', region:'中部', x:500, y:405 },
  { id:'shizuoka', name:'静岡', prefecture:'静岡県', region:'中部', x:590, y:470 },
  { id:'nagoya', name:'名古屋', prefecture:'愛知県', region:'中部', x:515, y:475 },
  { id:'kyoto', name:'京都', prefecture:'京都府', region:'近畿', x:445, y:455 },
  { id:'osaka', name:'大阪', prefecture:'大阪府', region:'近畿', x:430, y:490 },
  { id:'kobe', name:'神戸', prefecture:'兵庫県', region:'近畿', x:395, y:495 },
  { id:'okayama', name:'岡山', prefecture:'岡山県', region:'中国', x:340, y:480 },
  { id:'hiroshima', name:'広島', prefecture:'広島県', region:'中国', x:275, y:495 },
  { id:'matsuyama', name:'松山', prefecture:'愛媛県', region:'四国', x:310, y:555 },
  { id:'kochi', name:'高知', prefecture:'高知県', region:'四国', x:365, y:590 },
  { id:'hakata', name:'博多', prefecture:'福岡県', region:'九州', x:195, y:510 },
  { id:'kumamoto', name:'熊本', prefecture:'熊本県', region:'九州', x:185, y:565 },
  { id:'kagoshima', name:'鹿児島', prefecture:'鹿児島県', region:'九州', x:180, y:640 },
  { id:'naha', name:'那覇', prefecture:'沖縄県', region:'沖縄', x:80, y:675 },
]

const routes = [
  ['sapporo','hakodate'],['hakodate','aomori'],['aomori','morioka'],['morioka','sendai'],['sendai','tokyo'],
  ['niigata','tokyo'],['niigata','nagano'],['nagano','tokyo'],['tokyo','yokohama'],['yokohama','shizuoka'],
  ['shizuoka','nagoya'],['nagano','kanazawa'],['kanazawa','kyoto'],['nagoya','kyoto'],['kyoto','osaka'],
  ['osaka','kobe'],['kobe','okayama'],['okayama','hiroshima'],['hiroshima','hakata'],['okayama','matsuyama'],
  ['matsuyama','kochi'],['hakata','kumamoto'],['kumamoto','kagoshima']
]

const prefectures = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']

export default function Home() {
  const [visits, setVisits] = useState<Record<string, Visit>>({})
  const [selected, setSelected] = useState<Station | null>(null)
  const [date, setDate] = useState('')
  const [memo, setMemo] = useState('')
  const [tab, setTab] = useState<'map'|'progress'|'history'>('map')

  useEffect(() => {
    const raw = localStorage.getItem('nippon-loop-visits')
    if (raw) setVisits(JSON.parse(raw))
  }, [])

  const saveVisit = () => {
    if (!selected) return
    const next = { ...visits, [selected.id]: { stationId: selected.id, date: date || new Date().toISOString().slice(0,10), memo } }
    setVisits(next)
    localStorage.setItem('nippon-loop-visits', JSON.stringify(next))
    setSelected(null); setDate(''); setMemo('')
  }

  const removeVisit = (id: string) => {
    const next = { ...visits }; delete next[id]
    setVisits(next); localStorage.setItem('nippon-loop-visits', JSON.stringify(next)); setSelected(null)
  }

  const visitedStations = Object.keys(visits).length
  const visitedPrefectures = useMemo(() => new Set(stations.filter(s => visits[s.id]).map(s => s.prefecture)), [visits])
  const stationPct = Math.round((visitedStations / stations.length) * 100)

  const openStation = (s: Station) => {
    setSelected(s); const v = visits[s.id]; setDate(v?.date || ''); setMemo(v?.memo || '')
  }

  return (
    <main>
      <header className="topbar">
        <div><div className="brand">NIPPON LOOP</div><div className="subtitle">日本一周トラベルマップ</div></div>
        <div className="score"><strong>{stationPct}%</strong><span>駅マップ達成率</span></div>
      </header>

      <nav className="tabs">
        <button className={tab==='map'?'active':''} onClick={()=>setTab('map')}>🗾 全国マップ</button>
        <button className={tab==='progress'?'active':''} onClick={()=>setTab('progress')}>🏁 達成状況</button>
        <button className={tab==='history'?'active':''} onClick={()=>setTab('history')}>📖 旅行履歴</button>
      </nav>

      {tab === 'map' && <section className="mapSection">
        <div className="statsRow">
          <div className="stat"><b>{visitedStations}</b><span>訪問駅</span></div>
          <div className="stat"><b>{visitedPrefectures.size}</b><span>訪問都道府県</span></div>
          <div className="stat"><b>{stations.length-visitedStations}</b><span>未訪問駅</span></div>
        </div>
        <div className="mapCard">
          <div className="legend"><span><i className="dot visited"/>訪問済み</span><span><i className="dot"/>未訪問</span></div>
          <svg viewBox="0 0 850 720" role="img" aria-label="日本全国の旅行駅マップ">
            <path className="japanShape" d="M780 50 C730 90 730 165 690 195 C665 215 695 250 690 295 C680 350 705 395 675 430 C630 475 565 475 515 495 C455 520 390 500 335 505 C280 510 245 535 195 520 C155 510 135 555 150 610 C165 665 125 690 85 690"/>
            {routes.map(([a,b]) => { const s1=stations.find(s=>s.id===a)!; const s2=stations.find(s=>s.id===b)!; return <line key={a+b} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} className="route"/> })}
            {stations.map(s => <g key={s.id} onClick={()=>openStation(s)} className="stationGroup">
              <circle cx={s.x} cy={s.y} r="10" className={visits[s.id]?'station visitedStation':'station'} />
              <text x={s.x+14} y={s.y+5} className="stationLabel">{s.name}</text>
            </g>)}
          </svg>
          <p className="mapNote">駅をタップして訪問を記録。路線・座標・デザインは本アプリ独自の簡略表現です。</p>
        </div>
      </section>}

      {tab === 'progress' && <section className="contentCard">
        <h2>47都道府県の進捗</h2>
        <div className="progressGrid">{prefectures.map(p => <div key={p} className={visitedPrefectures.has(p)?'pref done':'pref'}><span>{visitedPrefectures.has(p)?'✓':'○'}</span>{p}</div>)}</div>
        <div className="achievement"><b>次の目標</b><p>{visitedPrefectures.size < 10 ? 'まずは10都道府県を訪問しよう。' : visitedPrefectures.size < 47 ? `あと${47-visitedPrefectures.size}都道府県で日本制覇。` : '47都道府県制覇！'}</p></div>
      </section>}

      {tab === 'history' && <section className="contentCard">
        <h2>旅行履歴</h2>
        {visitedStations === 0 ? <div className="empty">まだ訪問記録がありません。全国マップから最初の駅を登録してください。</div> :
          <div className="historyList">{Object.values(visits).sort((a,b)=>b.date.localeCompare(a.date)).map(v => { const s=stations.find(x=>x.id===v.stationId)!; return <button key={v.stationId} onClick={()=>openStation(s)} className="historyItem"><div><b>{s.name}</b><span>{s.prefecture}</span></div><div><time>{v.date}</time><p>{v.memo || 'メモなし'}</p></div></button> })}</div>}
      </section>}

      {selected && <div className="overlay" onClick={()=>setSelected(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <button className="close" onClick={()=>setSelected(null)}>×</button>
          <div className="eyebrow">{selected.region} · {selected.prefecture}</div>
          <h2>{selected.name}</h2>
          <label>訪問日<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>旅のメモ<textarea rows={4} placeholder="食べたもの、景色、思い出など" value={memo} onChange={e=>setMemo(e.target.value)} /></label>
          <button className="primary" onClick={saveVisit}>{visits[selected.id]?'記録を更新する':'訪問済みにする'}</button>
          {visits[selected.id] && <button className="danger" onClick={()=>removeVisit(selected.id)}>訪問記録を削除</button>}
        </div>
      </div>}

      <footer>Built for journeys across Japan · Data is stored on this device</footer>
    </main>
  )
}
