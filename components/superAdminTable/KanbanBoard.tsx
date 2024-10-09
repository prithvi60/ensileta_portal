import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useMutation, useQuery } from "@apollo/client";
import {
    CREATE_CARD,
    DELETE_KANBAN_CARDS,
    GET_KANBAN_CARDS,
    SAVE_KANBAN_CARD,
    UPDATE_KANBAN_CARDS,
} from "@/lib/Queries";
import { Loader } from "../Loader";
import toast from "react-hot-toast";

export const CustomKanban = ({ userId }: { userId: any }) => {
    return (
        <div className="h-auto w-full shadow-xl rounded-lg">
            <Board userId={userId} />
        </div>
    );
};

const Board = ({ userId }: { userId: any }) => {
    const { data, loading, error, refetch } = useQuery(GET_KANBAN_CARDS, {
        variables: { userId },
    });

    const [cards, setCards] = useState<any[]>([]);
    const [isDisable, setIsDisable] = useState(false);

    // const [saveKanbanCards] = useMutation(CARDS);
    const [updateKanbanCard] = useMutation(UPDATE_KANBAN_CARDS);

    useEffect(() => {
        if (data && data.kanbanCards) {
            setCards(data.kanbanCards);
        }
    }, [data]);

    // useEffect(() => {
    //     setIsDisable(cards.length > 0);
    // }, [cards]);

    if (loading) return <Loader />;
    if (error) return <p>Error: {error.message}</p>;

    // const handleSave = async () => {
    //     try {
    //         if (cards.length === 0) {
    //             return alert("Please add a new card before saving");
    //         }

    //         const updatedCards = cards.map((card: any) => ({
    //             id: card.id ? parseInt(card.id, 10) : undefined,
    //             title: card.title,
    //             column: card.column,
    //             userId: card.userId,
    //         }));

    //         // Execute the mutation to save cards to the database
    //         const result = await saveKanbanCards({
    //             variables: {
    //                 userId,
    //                 cards: updatedCards,
    //             },
    //         });

    //         if (result) {
    //             refetch();
    //             console.log("Cards saved successfully!");
    //         }
    //     } catch (error) {
    //         console.error("Error saving cards:", error);
    //     }
    // };

    const handleCardUpdate = async (
        cardId: number,
        newTitle: string,
        column: string
    ) => {
        try {
            const { data } = await updateKanbanCard({
                variables: { id: cardId, title: newTitle, column },
            });

            if (data.updateKanbanCard.success) {
                refetch(); // To update the client-side with the latest data
                console.log("Card updated successfully!");
                toast.success("Card updated successfully!", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #499d49",
                        padding: "16px",
                        color: "#499d49",
                    },
                    iconTheme: {
                        primary: "#499d49",
                        secondary: "#FFFAEE",
                    },
                });
            }
        } catch (error) {
            console.error("Error updating card:", error);
            toast.error("Error updating card", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #EB1C23",
                    padding: "16px",
                    color: "#EB1C23",
                },
                iconTheme: {
                    primary: "#EB1C23",
                    secondary: "#FFFAEE",
                },
            });
        }
    };

    return (
        <div className="px-6 py-8 md:p-12 overflow-scroll scrollbar flex flex-col justify-center items-center">
            <div className="flex justify-between h-auto scrollbar w-full gap-3 overflow-scroll p-12">
                <div className="flex flex-col items-center">
                    <Column
                        title="2D Note"
                        column="2D Note"
                        headingColor="text-neutral-500"
                        cards={cards}
                        setCards={setCards}
                        userId={userId}
                        handleCardUpdate={handleCardUpdate}
                        refetch={refetch}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <Column
                        title="3D Note"
                        column="3D Note"
                        headingColor="text-yellow-200"
                        cards={cards}
                        setCards={setCards}
                        userId={userId}
                        handleCardUpdate={handleCardUpdate}
                        refetch={refetch}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <Column
                        title="BOQ Note"
                        column="BOQ Note"
                        headingColor="text-blue-200"
                        cards={cards}
                        setCards={setCards}
                        userId={userId}
                        handleCardUpdate={handleCardUpdate}
                        refetch={refetch}
                    />
                </div>
            </div>
            <div className="flex gap-3 items-center">
                <BurnBarrel setCards={setCards} refetch={refetch} />
                {/* <button
                    onClick={handleSave}
                    disabled={!isDisable}
                    className={`w-full py-8 mt-10 cursor-pointer px-5 text-white bg-secondary text-sm hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed`}
                >
                    Save Comments
                </button> */}
            </div>
        </div>
    );
};

const Column = ({
    title,
    cards,
    column,
    setCards,
    userId,
    handleCardUpdate,
    refetch
}: any) => {
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
        <div className="min-w-56 md:w-full shrink-0">
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
                    return (
                        <Card
                            key={c.id}
                            {...c}
                            handleDragStart={handleDragStart}
                            handleCardUpdate={handleCardUpdate}
                        />
                    );
                })}
                <DropIndicator beforeId={null} column={column} />
                <AddCard
                    column={column}
                    userId={userId}
                    setCards={setCards}
                    cards={cards}
                    refetch={refetch}
                />
            </div>
        </div>
    );
};

const Card = ({ title, id, column, handleDragStart, handleCardUpdate }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const stringId = id !== undefined ? id.toString() : '';

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        handleCardUpdate(id, newTitle, column);
        setIsEditing(false);
    };
    return (
        <>
            <DropIndicator beforeId={stringId} column={column} />
            {isEditing ? (
                <motion.div>
                    <textarea
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-400 bg-[#1E3A8A] p-3 text-sm text-white placeholder-white focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 text-xs text-warning transition-colors hover:text-warning/40"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-success px-3 py-1.5 text-xs text-white transition-colors hover:bg-success/50"
                        >
                            <span>Save</span>
                            <FiPlus />
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    layout
                    layoutId={stringId}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, { title, id, column })}
                    onClick={handleEdit}
                    className="cursor-grab rounded border border-primary/60 bg-primary p-3 active:cursor-grabbing"
                >
                    <p className="text-sm text-neutral-100">{title}</p>
                </motion.div>
            )}
        </>
    );
};

const DropIndicator = ({ beforeId, column }: any) => {
    const id = beforeId
    return (
        <div
            data-before={id || "-1"}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-secondary opacity-0"
        />
    );
};

const BurnBarrel = ({ setCards, refetch }: any) => {
    const [active, setActive] = useState(false);
    const [deleteKanbanCard] = useMutation(DELETE_KANBAN_CARDS);

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = async (e: any) => {
        const cardId = e.dataTransfer.getData("cardId");

        try {
            // Call the mutation to delete the card from the database
            const { data } = await deleteKanbanCard({
                variables: { id: parseInt(cardId, 10) },
            });

            if (data.deleteKanbanCard.success) {
                // Remove the card from the state
                setCards((prev: any) => prev.filter((c: any) => c.id !== cardId));
                refetch();
                toast.success("Card deleted successfully!", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #499d49",
                        padding: "16px",
                        color: "#499d49",
                    },
                    iconTheme: {
                        primary: "#499d49",
                        secondary: "#FFFAEE",
                    },
                });
            } else {
                console.error("Failed to delete card:", data.deleteKanbanCard.message);
                toast.error("Failed to delete card", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #EB1C23",
                        padding: "16px",
                        color: "#EB1C23",
                    },
                    iconTheme: {
                        primary: "#EB1C23",
                        secondary: "#FFFAEE",
                    },
                });
            }
        } catch (error) {
            console.error("Error deleting card:", error);
        }

        setActive(false);
    };

    return (
        // <div className="text-center w-full gap-2 flex flex-col justify-center items-center">
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid py-3 px-5 shrink-0 place-items-center gap-3 place-content-center rounded border text-3xl ${active
                ? "border-red-800 bg-warning/50 text-warning/80"
                : "border-neutral-500 bg-primary text-white"
                }`}
        >
            <h4 className="text-center">{active ? <FaFire className="animate-bounce text-xl" /> : <FiTrash />}</h4>
            <p
                className={`text-xs w-full ${active ? " text-warning/65" : "text-white whitespace-normal"
                    }`}
            >
                Drag & Drop to delete
            </p>
        </div>
    );
};

const AddCard = ({ column, setCards, cards, userId, refetch }: any) => {

    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);
    // const [createCard] = useMutation(SAVE_KANBAN_CARD);
    const [saveKanbanCard] = useMutation(SAVE_KANBAN_CARD);
    // console.log(userId);


    // const handleSubmit = async (e: any) => {
    //     e.preventDefault();

    //     if (!text.trim().length) return;

    //     const newCard = {
    //         column,
    //         title: text.trim(),
    //         userId,
    //     };

    //     try {
    //         // Save the new card to the database
    //         const { data } = await createCard({
    //             variables: { userId, card: newCard },
    //         });

    //         console.log(data);


    //         // Update local state if mutation is successful
    //         if (data?.createKanbanCard) {
    //             setCards((pv: any) => [...pv, newCard]);
    //             refetch()
    //             // console.log("");
    //             toast.success("Card added successfully!", {
    //                 position: "top-right",
    //                 duration: 3000,
    //                 style: {
    //                     border: "1px solid #499d49",
    //                     padding: "16px",
    //                     color: "#499d49",
    //                 },
    //                 iconTheme: {
    //                     primary: "#499d49",
    //                     secondary: "#FFFAEE",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error adding card:", error);
    //         toast.error("Failed to add card", {
    //             position: "top-right",
    //             duration: 3000,
    //             style: {
    //                 border: "1px solid #EB1C23",
    //                 padding: "16px",
    //                 color: "#EB1C23",
    //             },
    //             iconTheme: {
    //                 primary: "#EB1C23",
    //                 secondary: "#FFFAEE",
    //             },
    //         });
    //     }

    //     setAdding(false);
    // };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            userId,
        };

        try {
            const { data } = await saveKanbanCard({
                variables: { userId, card: newCard }, // Ensure variables align
            });

            if (data?.saveKanbanCard) {
                setCards((prevCards: any) => [...prevCards, newCard]);
                refetch();
                console.log("Card added successfully!");
            }
        } catch (error) {
            console.error("Error adding card:", error);
        }

        setAdding(false);
        setText("");
    };


    // const [text, setText] = useState("");
    // const [adding, setAdding] = useState(false);

    // const handleSubmit = (e: any) => {
    //     e.preventDefault();

    //     if (!text.trim().length) return;

    //     const newCard = {
    //         column,
    //         title: text.trim(),
    //         id: (Math.floor(Math.random() * 100) + 1).toString(),
    //         userId,
    //     };

    //     setCards((pv: any) => [...pv, newCard]);

    //     setAdding(false);
    // };

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
