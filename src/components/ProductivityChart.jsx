import React, { useState } from "react"
import TimeRequestModal from "./TimeRequestModal"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"


const defaultAppUsage = {
    Productive: [
        { app: "stackoverflow.com", duration: 26 },
        { app: "google.com", duration: 60 },
        { app: "chrome", duration: 20 },
    ],
    Neutral: [
        { app: "email", duration: 15 },
        { app: "slack", duration: 10 },
    ],
    Unproductive: [
        { app: "youtube.com", duration: 45 },
        { app: "facebook.com", duration: 30 },
    ],
};

const hourlyData = [
    { time: "09AM", Productive: 60, Neutral: 20, Unproductive: 20, appUsage: defaultAppUsage },
    { time: "10AM", Productive: 50, Neutral: 30, Unproductive: 20, appUsage: defaultAppUsage },
    { time: "11AM", Productive: 40, Neutral: 30, Unproductive: 30, appUsage: defaultAppUsage },
    { time: "12PM", Productive: 30, Neutral: 20, Unproductive: 50, appUsage: defaultAppUsage },
    { time: "01PM", Productive: 70, Neutral: 10, Unproductive: 20, appUsage: defaultAppUsage },
    { time: "02PM", Productive: 50, Neutral: 25, Unproductive: 25, appUsage: defaultAppUsage },
    { time: "03PM", Productive: 60, Neutral: 20, Unproductive: 20, appUsage: defaultAppUsage },
    { time: "04PM", Productive: 80, Neutral: 10, Unproductive: 10, appUsage: defaultAppUsage },
    { time: "05PM", Productive: 50, Neutral: 30, Unproductive: 20, appUsage: defaultAppUsage },
    { time: "06PM", Productive: 40, Neutral: 30, Unproductive: 30, appUsage: defaultAppUsage },
    { time: "07PM", Productive: 60, Neutral: 10, Unproductive: 30, appUsage: defaultAppUsage },
];

const intervalData = [];
for (let hour = 9; hour <= 19; hour++) {
    for (let i = 0; i < 12; i++) {
        const label = `${hour.toString().padStart(2, "0")}:${(i * 5).toString().padStart(2, "0")}`;
        intervalData.push({
            time: label,
            Productive: Math.floor(Math.random() * 2),
            Neutral: Math.floor(Math.random() * 2),
            Unproductive: Math.floor(Math.random() * 2),
            appUsage: defaultAppUsage,
        });
    }
}

const formatDuration = (secs) => {
    if (secs < 60) return `${secs} s`;
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins} min${seconds > 0 ? ` ${seconds}s` : ""}`;
};

const CustomSingleAppTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const { dataKey, payload: barData } = payload[0];
    const apps = barData?.appUsage?.[dataKey] || [];

    return (
        <div
            style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px",
                width: "220px",
            }}
        >
            <strong>{dataKey} Apps</strong>
            <ul style={{ paddingLeft: 18 }}>
                {apps.map((app, idx) => (
                    <li key={idx}>
                        {app.app} — {formatDuration(app.duration)}
                    </li>
                ))}
            </ul>
            <div style={{ fontSize: "13px", marginTop: 6 }}>
                <strong>⏰ {label}</strong>
            </div>
        </div>
    );
};

export default function ProductivityChart() {
    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleBarClick = (data) => {
        if (data.Productive === 0 && data.Neutral === 0 && data.Unproductive === 0) {
            setSelectedTime({ start: data.time, end: data.time });
            setShowModal(true);
        }
    };

    const handleSave = ({ type, description }) => {
        console.log("Time Request:", { type, description, selectedTime });
        setShowModal(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ fontWeight: "bold" }}>Tracked Hours</h2>

            {/* Graph A */}
            <div style={{ width: "100%", height: 300, marginBottom: "40px" }}>
                <ResponsiveContainer>
                    <BarChart data={hourlyData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip content={<CustomSingleAppTooltip />} shared={false} />
                        <Legend />
                        <Bar dataKey="Productive" stackId="a" fill="#1A840A" />
                        <Bar dataKey="Neutral" stackId="a" fill="#EFA207" />
                        <Bar dataKey="Unproductive" stackId="a" fill="#A8A5A4" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Graph B */}
            <div
                style={{
                    width: "100%",
                    height: 400,
                    overflowX: "auto",
                    border: "1px solid #ddd",
                }}
            >
                <ResponsiveContainer width={intervalData.length * 20} height="100%">
                    <BarChart
                        data={intervalData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap={10}
                        barGap={4}
                        onClick={({ activePayload }) =>
                            activePayload &&
                            activePayload[0] &&
                            handleBarClick(activePayload[0].payload)
                        }
                    >
                        <XAxis type="number" hide />
                        <YAxis dataKey="time" type="category" width={70} />
                        <Tooltip content={<CustomSingleAppTooltip />} shared={false} />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="Productive" stackId="a" fill="#1A840A" />
                        <Bar dataKey="Neutral" stackId="a" fill="#EFA207" />
                        <Bar dataKey="Unproductive" stackId="a" fill="#A8A5A4" />
                    </BarChart>
                </ResponsiveContainer>

                <TimeRequestModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    timeRange={selectedTime || { start: "", end: "" }}
                />
            </div>
        </div>
    );
}



