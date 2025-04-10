import React, { useState, useEffect } from "react";
import { Range } from "react-range";

const MIN = 540; // 09:00 AM
const MAX = 1140; // 07:00 PM
const STEP = 5;

const TimeRequestModal = ({ show, onClose, onSave, timeRange }) => {
    const [type, setType] = useState("Productive");
    const [description, setDescription] = useState("");

    const parseTimeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const formatMinutesToTime = (mins) => {
        const h = Math.floor(mins / 60).toString().padStart(2, "0");
        const m = (mins % 60).toString().padStart(2, "0");
        return `${h}:${m}`;
    };

    const initialStart = parseTimeToMinutes(timeRange.start || "09:00");
    const initialEnd = parseTimeToMinutes(timeRange.end || "09:05");

    const [values, setValues] = useState([initialStart, initialEnd]);

    useEffect(() => {
        setValues([initialStart, initialEnd]);
    }, [timeRange]);

    if (!show) return null;

    const handleSave = () => {
        onSave({
            type,
            description,
            adjustedTimeRange: {
                start: formatMinutesToTime(values[0]),
                end: formatMinutesToTime(values[1]),
            },
        });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3>Offline Time</h3>

                <div style={styles.range}>
                    {formatMinutesToTime(values[0])} — {formatMinutesToTime(values[1])}
                </div>

                <div style={{ margin: "20px 0" }}>
                    <Range
                        step={STEP}
                        min={MIN}
                        max={MAX}
                        values={values}
                        onChange={(vals) => setValues(vals)}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "6px",
                                    width: "100%",
                                    backgroundColor: "#e5e7eb",
                                    borderRadius: "3px",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        height: "6px",
                                        backgroundColor: "#60a5fa",
                                        borderRadius: "3px",
                                        left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                                        width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%`,
                                    }}
                                />
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "24px",
                                    width: "24px",
                                    borderRadius: "4px",
                                    backgroundColor: "#3b82f6",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0 0 0 2px #fff",
                                    cursor: "pointer",
                                }}
                            />
                        )}
                    />
                </div>

                <input
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div style={styles.buttons}>
                    {["Productive", "Unproductive", "Neutral"].map((val) => (
                        <button
                            key={val}
                            style={{
                                ...styles.option,
                                backgroundColor: type === val ? "#d1fae5" : "#f3f4f6",
                            }}
                            onClick={() => setType(val)}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.cancel}>Cancel</button>
                    <button onClick={handleSave} style={styles.save}>Save</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center",
    },
    modal: {
        backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 400,
    },
    range: { margin: "10px 0", fontWeight: "bold" },
    input: { width: "96%", padding: 8, marginBottom: 10 },
    buttons: { display: "flex", justifyContent: "space-around", marginBottom: 10 },
    option: { padding: "10px 15px", borderRadius: 5, border: "1px solid #ccc" },
    footer: { display: "flex", justifyContent: "space-between" },
    cancel: { padding: "10px 15px" },
    save: {
        padding: "10px 15px",
        background: "linear-gradient(to right, #fbbf24, #f97316)",
        border: "none",
        color: "#fff",
        borderRadius: 5,
    },
};

export default TimeRequestModal;
