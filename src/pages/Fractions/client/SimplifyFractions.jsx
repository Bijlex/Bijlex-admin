import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

Chart.register(ArcElement, Tooltip, Legend);

const ItemTypes = {
    FULL_PIE: 'fullPie',
    PIECE: 'piece',
    GENERATED_PIE: 'generatedPie',
};

const PiePiece = ({ index, divisions, draggable, type }) => {
    const [, drag] = useDrag(() => ({
        type: type,
        item: { index, divisions, type },
        canDrag: draggable,
    }));

    return (
        <div
            ref={drag}
            style={{
                width: '50px',
                height: '50px',
                backgroundColor: type === ItemTypes.FULL_PIE ? '#36A2EB' : '#CCCCCC',
                margin: '5px',
                cursor: draggable ? 'move' : 'default',
                borderRadius: '50%',
            }}
        ></div>
    );
};

const DraggablePie = ({ pie, index, allSlicesBlue }) => {
    const [, drag] = useDrag(() => ({
        type: ItemTypes.GENERATED_PIE,
        item: { pie, index, allSlicesBlue },
    }));

    return (
        <div
            ref={drag}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '20px',
                cursor: 'move',
            }}
        >
            <Pie data={pieData(pie.divisions, pie.slices, allSlicesBlue)} options={pieOptions} />
        </div>
    );
};

const DropBox = ({ onDropPiece, generatedPies }) => {
    const [, drop] = useDrop(() => ({
        accept: [ItemTypes.FULL_PIE, ItemTypes.PIECE, ItemTypes.GENERATED_PIE],
        drop: (item) => onDropPiece(item),
    }));

    return (
        <div
            ref={drop}
            style={{
                minHeight: '150px',
                width: '200px',
                border: '1px solid black',
                padding: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            {generatedPies.map((pie, index) => (
                <DraggablePie key={index} pie={pie} index={index} />
            ))}
        </div>
    );
};

const pieData = (divisions, slices, firstSliceBlue = false) => ({
    labels: Array(divisions).fill(''),
    datasets: [
        {
            data: slices,
            backgroundColor: slices.map((slice, index) => (index !== 0 && firstSliceBlue) ? 'grey' : 'blue'),
        },
    ],
});

const pieOptions = {
    plugins: {
        legend: {
            display: false,
        },
    },
};

function SimplifyFractions({ customData }) {
    const [generatedPies, setGeneratedPies] = useState([]);

    const handleDropPiece = (item) => {
        let firstSliceBlue = false;
    
        if (item.type === ItemTypes.FULL_PIE) {
            firstSliceBlue = true;
        } else if (item.type === ItemTypes.PIECE) {
            firstSliceBlue = false;
        }
    
        const newPie = {
            divisions: item.divisions,
            slices: Array(item.divisions).fill(1),
        };
    
        setGeneratedPies([...generatedPies, newPie]);
    }; 

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                style={{
                    padding: '50px',
                    fontFamily: 'Arial, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h2 style={{ marginBottom: '20px' }}>Simplify Fractions</h2>
                <div
                    style={{
                        marginBottom: '20px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                >
                    Fraction: {customData?.fractionNumber}
                </div>
                <DropBox onDropPiece={handleDropPiece} generatedPies={generatedPies} />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '100%',
                        marginTop: '30px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Pie data={pieData(6, Array(6).fill(1), true)} options={pieOptions} />
                        <PiePiece index={0} divisions={6} draggable={true} type={ItemTypes.FULL_PIE} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Pie data={pieData(6, Array(6).fill(1))} options={pieOptions} />
                        <PiePiece index={0} divisions={6} draggable={true} type={ItemTypes.FULL_PIE} />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default SimplifyFractions;
