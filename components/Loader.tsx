import React, { useCallback, useEffect, useState } from "react";
import {
    AnimationProps,
    DynamicAnimationOptions,
    motion,
    useAnimate,
} from "framer-motion";

export const Loader = () => {
    return (
        <div className="grid h-full place-content-center p-4 mt-48">
            <ShuffleLoader />
        </div>
    );
};

const NUM_BLOCKS = 5;
const BLOCK_SIZE = 32;

const DURATION_IN_MS = 175;
const DURATION_IN_SECS = DURATION_IN_MS * 0.001;

const TRANSITION: DynamicAnimationOptions = {
    ease: "easeInOut",
    duration: DURATION_IN_SECS,
};

export const ShuffleLoader = () => {
    const [blocks, setBlocks] = useState(
        Array.from(Array(NUM_BLOCKS).keys()).map((n) => ({ id: n }))
    );
    const [scope, animate] = useAnimate();

    const shuffle = useCallback(async () => {
        while (true) {
            const [first, second] = pickTwoRandom();
            const firstElement = document.querySelector(`[data-block-id="${first.id}"]`);
            const secondElement = document.querySelector(`[data-block-id="${second.id}"]`);

            if (!firstElement || !secondElement) {
                console.error("Element not found:", { firstElement, secondElement });
                return;
            }

            animate(firstElement, { y: -BLOCK_SIZE }, TRANSITION);

            await animate(secondElement, { y: BLOCK_SIZE }, TRANSITION);

            await delay(DURATION_IN_MS);

            setBlocks((pv) => {
                const copy = [...pv];

                const indexForFirst = copy.indexOf(first);
                const indexForSecond = copy.indexOf(second);

                copy[indexForFirst] = second;
                copy[indexForSecond] = first;

                return copy;
            });

            await delay(DURATION_IN_MS * 2);

            animate(firstElement, { y: 0 }, TRANSITION);

            await animate(secondElement, { y: 0 }, TRANSITION);

            await delay(DURATION_IN_MS);
        }
    }, [setBlocks, animate]);

    useEffect(() => {
        shuffle();
    }, [shuffle]);

    const pickTwoRandom = () => {
        const index1 = Math.floor(Math.random() * blocks.length);
        let index2 = Math.floor(Math.random() * blocks.length);

        while (index2 === index1) {
            index2 = Math.floor(Math.random() * blocks.length);
        }

        return [blocks[index1], blocks[index2]];
    };

    const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    return (
        <div ref={scope} className="flex justify-center items-center gap-0.5 h-[70vh]">
            {blocks.map((b) => {
                return (
                    <motion.div
                        layout
                        data-block-id={b.id}
                        key={b.id}
                        transition={TRANSITION as AnimationProps["transition"]}
                        style={{
                            width: BLOCK_SIZE,
                            height: BLOCK_SIZE,
                        }}
                        className="bg-secondary"
                    />
                );
            })}
        </div>
    );
};