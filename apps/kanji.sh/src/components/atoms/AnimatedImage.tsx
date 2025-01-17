'use client';

import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';
import ReadingSvg from '../../assets/vectors/reading.svg';
import WritingSvg from '../../assets/vectors/writing.svg';
import PrintingSvg from '../../assets/vectors/printing.svg';
import SubscribedSvg from '../../assets/vectors/subscribed.svg';

type AnimationProps = {
    animationName: 'reading' | 'writing' | 'printing' | 'subscribed';
    className: string;
    loop?: boolean;
};

const SvgFallbacks = {
    reading: ReadingSvg,
    writing: WritingSvg,
    printing: PrintingSvg,
    subscribed: SubscribedSvg
};

export const AnimatedImage = ({ animationName, className, loop = false }: AnimationProps) => {
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const [display, setDisplay] = React.useState<'anim' | 'svg'>('svg');

    const SvgFallback = SvgFallbacks[animationName];

    useEffect(() => {
        if (animationContainerRef.current) {
            const animationItem = Lottie.loadAnimation({
                path: `/assets/anim/${animationName}.json`,
                loop,
                renderer: 'svg',
                container: animationContainerRef.current
            });
            animationItem.addEventListener('data_ready', () => {
                setDisplay('anim');
            });
        }
    }, []);

    return (
        <div className={clsx(className)}>
            <div
                ref={animationContainerRef}
                className={clsx('w-full h-full', { hidden: display === 'svg' })}
            />
            <SvgFallback className={clsx('w-full h-full', { hidden: display === 'anim' })} />
        </div>
    );
};

export const ReadingAnimation = (props: { className: string }) => (
    <AnimatedImage className={props.className} loop={true} animationName={'reading'} />
);

export const WritingAnimation = (props: { className: string }) => (
    <AnimatedImage className={props.className} loop={true} animationName={'writing'} />
);

export const PrintingAnimation = (props: { className: string }) => (
    <AnimatedImage className={props.className} loop={false} animationName={'printing'} />
);

export const SubscribedAnimation = (props: { className: string }) => (
    <AnimatedImage className={props.className} loop={false} animationName={'subscribed'} />
);
