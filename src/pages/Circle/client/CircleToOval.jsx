// import React, { useState } from 'react';
// import Draggable from 'react-draggable';

// function CircleToOval({ customData }) {
//     const [circleRadius, setCircleRadius] = useState(80);
//     const [dragPosition, setDragPosition] = useState({ x: 100, y: 200 - circleRadius });
//     const questionPrompt = customData?.questionPrompt || "No prompt provided";

//     const handleDrag = (e, ui) => {
//         const newY = dragPosition.y + ui.deltaY;
//         const newRadius = 200 - newY;
//         if (newRadius > 0 && newRadius <= 160) {
//             setCircleRadius(newRadius);
//             setDragPosition({ x: 100, y: newY });
//         }
//     };

//     return (
//         <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <h2 style={{ marginBottom: '30px' }}>{questionPrompt}</h2>
//             <svg width="200" height="400" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
//                 {/* Outer Oval */}
//                 <ellipse cx="100" cy="200" rx="80" ry="160" stroke="black" strokeWidth="2" fill="none" />
//                 {/* Inner Oval */}
//                 <ellipse cx="100" cy="200" rx="70" ry="140" stroke="black" strokeWidth="1" fill="none" />
                
//                 {/* Circle */}
//                 <circle cx="100" cy="200" r={circleRadius} stroke="black" strokeWidth="10" fill="none" />
                
//                 {/* Draggable Point on the circle */}
//                 <Draggable
//                     axis="y"
//                     bounds={{ top: 40, bottom: 200 }}
//                     position={dragPosition}
//                     onDrag={handleDrag}
//                 >
//                     <circle cx={dragPosition.x - 100} cy={dragPosition.y - 120} r="10" fill="red" cursor="pointer" />
//                 </Draggable>
//             </svg>
//         </div>
//     );
// }

// export default CircleToOval;


import React, { useState } from 'react';
import Draggable from 'react-draggable';

function CircleToOval({ customData }) {
    const [circleRadius, setCircleRadius] = useState(80);
    const questionPrompt = customData?.questionPrompt || "No prompt provided";

    const handleDrag = (e, ui) => {
        const newRadius = circleRadius - ui.deltaY;
        if (newRadius > 0 && newRadius <= 160) {
            setCircleRadius(newRadius);
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '30px' }}>{questionPrompt}</h2>
            <svg width="200" height="400" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Oval */}
                <ellipse cx="100" cy="200" rx="80" ry="160" stroke="black" strokeWidth="2" fill="none" />
                {/* Inner Oval */}
                <ellipse cx="100" cy="200" rx="70" ry="140" stroke="black" strokeWidth="1" fill="none" />
                
                {/* Circle */}
                <circle cx="100" cy="200" r={circleRadius} stroke="black" strokeWidth="10" fill="none" />
                
                {/* Draggable Point on the circle */}
                <Draggable
                    axis="y"
                    bounds={{ top: 200 - 160, bottom: 200 - 80 }}
                    position={{ x: 100, y: 200 - circleRadius }}
                    onDrag={handleDrag}
                    onStop={(_, data) => {
                        const newY = data.y;
                        const newRadius = 200 - newY;
                        setCircleRadius(newRadius);
                    }}
                >
                    <circle cx="0" cy={circleRadius - 80} r="10" fill="red" cursor="pointer" />
                </Draggable>
            </svg>
        </div>
    );
}

export default CircleToOval;
