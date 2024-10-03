import React, { useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

export const CustomKanban = () => {
    return (
        <div className="h-auto w-full shadow-xl rounded-lg">
            <Board />
        </div>
    );
};

const Board = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);

    return (
        <div className="flex justify-between h-auto scrollbar w-full gap-3 overflow-scroll p-12">
            <div className="flex flex-col items-center">
                <Column
                    title="2D Note"
                    column="2D Note"
                    headingColor="text-neutral-500"
                    cards={cards}
                    setCards={setCards}
                />
                <BurnBarrel setCards={setCards} />
            </div>
            <div className="flex flex-col items-center">
                <Column
                    title="3D Note"
                    column="3D Note"
                    headingColor="text-yellow-200"
                    cards={cards}
                    setCards={setCards}
                />
                <BurnBarrel setCards={setCards} />
            </div>
            <div className="flex flex-col items-center">
                <Column
                    title="BOQ Note"
                    column="BOQ Note"
                    headingColor="text-blue-200"
                    cards={cards}
                    setCards={setCards}
                />
                <BurnBarrel setCards={setCards} />
            </div>
        </div>
    );
};


const Column = ({ title, headingColor, cards, column, setCards }: any) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e: any, card: any) => {
        e.dataTransfer.setData("cardId", card.id);
    };

    const handleDragEnd = (e: any) => {
        const cardId = e.dataTransfer.getData("cardId");

        setActive(false);
        // clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...cards];

            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        highlightIndicator(e);

        setActive(true);
    };

    const clearHighlights = (els: any) => {
        const indicators = els || getIndicators();

        indicators.forEach((i: any) => {
            i.style.opacity = "0";
        });
    };

    const highlightIndicator = (e: any) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);

        el.element.style.opacity = "1";
    };

    const getNearestIndicator = (e: any, indicators: any) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest: any, child: any) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    const handleDragLeave = () => {
        // clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c: any) => c.column === column);

    return (
        <div className="w-56 md:w-full shrink-0">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium text-primary`}>{title}</h3>
                {/* <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span> */}
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full w-full transition-colors ${active ? "bg-success/50" : "bg-success/0"
                    }`}
            >
                {filteredCards.map((c: any) => {
                    return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
                })}
                <DropIndicator beforeId={null} column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
    );
};

const Card = ({ title, id, column, handleDragStart }: any) => {
    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className="cursor-grab rounded border border-primary/60 bg-primary p-3 active:cursor-grabbing"
            >
                <p className="text-sm text-neutral-100">{title}</p>
            </motion.div>
        </>
    );
};

const DropIndicator = ({ beforeId, column }: any) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-secondary opacity-0"
        />
    );
};

const BurnBarrel = ({ setCards }: any) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e: any) => {
        const cardId = e.dataTransfer.getData("cardId");

        setCards((pv: any) => pv.filter((c: any) => c.id !== cardId));

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid size-14 shrink-0 place-content-center rounded border text-3xl ${active
                ? "border-red-800 bg-warning/50 text-warning/80"
                : "border-neutral-500 bg-primary text-white"
                }`}
        >
            {active ? <FaFire className="animate-bounce text-xl" /> : <FiTrash />}
        </div>
    );
};

const AddCard = ({ column, setCards }: any) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
        };

        setCards((pv: any) => [...pv, newCard]);

        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-400 bg-[#1E3A8A] p-3 text-sm text-white placeholder-white focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-warning transition-colors hover:text-warning/40"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-success px-3 py-1.5 text-xs text-white transition-colors hover:bg-success/50"
                        >
                            <span>Add</span>
                            <FiPlus />
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-primary transition-colors hover:text-primary/80"
                >
                    <span>Add card</span>
                    <FiPlus />
                </motion.button>
            )}
        </>
    );
};

const DEFAULT_CARDS = [
    // BACKLOG
    { title: "Look into render bug in dashboard", id: "1", column: "2D Note" },
    { title: "SOX compliance checklist", id: "2", column: "2D Note" },
    { title: "[SPIKE] Migrate to Azure", id: "3", column: "2D Note" },
    { title: "Document Notifications service", id: "4", column: "2D Note" },
    // TODO
    {
        title: "Research DB options for new microservice",
        id: "5",
        column: "3D Note",
    },
    { title: "Postmortem for outage", id: "6", column: "3D Note" },
    { title: "Sync with product on Q3 roadmap", id: "7", column: "3D Note" },

    // DOING
    {
        title: "Refactor context providers to use Zustand",
        id: "8",
        column: "BOQ Note",
    },
    { title: "Add logging to daily CRON", id: "9", column: "BOQ Note" },
    // DONE
    // {
    //     title: "Set up DD dashboards for Lambda listener",
    //     id: "10",
    //     column: "done",
    // },
];