
import React, { useState } from 'react';
import { OdontogramData, OdontogramToothState } from '../../types';

interface OdontogramProps {
  data: OdontogramData;
  onUpdate: (data: OdontogramData) => void;
  disabled: boolean;
}

const TOOTH_LAYOUT = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
};

const TOOTH_STATES = Object.values(OdontogramToothState);
const TOOTH_STATE_COLORS: Record<OdontogramToothState, string> = {
    [OdontogramToothState.Sehat]: 'bg-white border-gray-300 text-black',
    [OdontogramToothState.Karies]: 'bg-red-500 text-white',
    [OdontogramToothState.TambalanAmalgam]: 'bg-gray-600 text-white',
    [OdontogramToothState.TambalanLain]: 'bg-blue-400 text-white',
    [OdontogramToothState.Mahkota]: 'bg-yellow-400 text-black',
    [OdontogramToothState.Hilang]: 'bg-black text-white',
    [OdontogramToothState.SisaAkar]: 'bg-red-800 text-white',
    [OdontogramToothState.Jembatan]: 'bg-purple-500 text-white',
    [OdontogramToothState.BelumErupsi]: 'bg-gray-300 text-gray-600',
};


const Tooth: React.FC<{
  id: number;
  state?: OdontogramToothState;
  onClick: () => void;
  disabled: boolean;
}> = ({ id, state = OdontogramToothState.Sehat, onClick, disabled }) => {
  const colorClasses = TOOTH_STATE_COLORS[state] || TOOTH_STATE_COLORS[OdontogramToothState.Sehat];
  return (
    <div className="text-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-10 h-10 rounded-md border text-sm font-semibold flex items-center justify-center transition-all duration-200 ${colorClasses} ${!disabled ? 'hover:ring-2 hover:ring-offset-2 hover:ring-tni-au' : 'cursor-not-allowed'}`}
      >
        {state}
      </button>
      <span className="text-xs text-gray-500 mt-1 block">{id}</span>
    </div>
  );
};

const Quadrant: React.FC<{
  ids: number[];
  data: OdontogramData;
  onToothClick: (id: number) => void;
  disabled: boolean;
}> = ({ ids, data, onToothClick, disabled }) => (
  <div className="flex justify-center items-end gap-1">
    {ids.map(id => (
      <Tooth key={id} id={id} state={data[id]} onClick={() => onToothClick(id)} disabled={disabled} />
    ))}
  </div>
);

const Odontogram: React.FC<OdontogramProps> = ({ data, onUpdate, disabled }) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const handleToothClick = (id: number) => {
    if(!disabled) {
        setSelectedTooth(id);
    }
  };

  const handleStateSelect = (state: OdontogramToothState) => {
    if (selectedTooth) {
      const newData = { ...data, [selectedTooth]: state };
      onUpdate(newData);
      setSelectedTooth(null);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        <Quadrant ids={TOOTH_LAYOUT.upperRight} data={data} onToothClick={handleToothClick} disabled={disabled} />
        <Quadrant ids={TOOTH_LAYOUT.upperLeft} data={data} onToothClick={handleToothClick} disabled={disabled} />
        <Quadrant ids={TOOTH_LAYOUT.lowerRight} data={data} onToothClick={handleToothClick} disabled={disabled} />
        <Quadrant ids={TOOTH_LAYOUT.lowerLeft} data={data} onToothClick={handleToothClick} disabled={disabled} />
      </div>

      {selectedTooth && (
        <div className="mt-6 p-4 bg-tni-au-light rounded-md">
            <h4 className="font-semibold mb-2">Pilih Kondisi untuk Gigi #{selectedTooth}</h4>
            <div className="flex flex-wrap gap-2">
                {TOOTH_STATES.map(state => (
                    <button
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${TOOTH_STATE_COLORS[state]}`}
                    >
                       {state} - {state === OdontogramToothState.Sehat ? "Sehat" : state === OdontogramToothState.Karies ? "Karies" : "Lainnya"}
                    </button>
                ))}
                 <button onClick={() => setSelectedTooth(null)} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-400 hover:bg-gray-500 text-white">
                    Batal
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Odontogram;
