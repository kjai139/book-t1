'use client'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState } from 'react'
import NextImage from 'next/image'
import { Button } from '@nextui-org/react'
import StarsOnly from '../rating/starsDisplayOnly'
import { GoDotFill } from 'react-icons/go'

interface MainDynamicSlideProps {
    slideArr: []
}

export default function MainDynamicSlide ({slideArr}:MainDynamicSlideProps) {

    const [slides, setSlides] = useState(slideArr)

    const settings = {
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 500,
        speed:500,
        pauseonHover: true,
        responsive: [
            {
                breakpoint:1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    dots:true,

                }
            },
            {
                breakpoint:600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots:true,
                    autoplay: false,
                    autoplaySpeed: 3000,
                    speed:500,
                    pauseonHover: true,
                    className: 'w-[80%] p-2',
                    
                    
                    
                    
                }
            },
            {
                breakpoint:400,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots:true,
                    autoplay: false,
                    autoplaySpeed: 3000,
                    speed:500,
                    arrows: false,
                    pauseonHover: true,
                    className: 'w-[100%] p-2',
                    appendDots: dots => (
                        <div style={{

                        }}>
                            <ul>{dots}</ul>

                        </div>
                    ),
                    customPaging: i => (
                        <GoDotFill>
                            {i + 1}
                        </GoDotFill>
                    ),
                    dotsClass: 'slider-dots'
                    
                    
                    
                    
                }
            }
        ]


    }

    return (
        <div className='slider-container flex items-center justify-center'>
            <Slider {...settings}>
                {slides.map((slide) => {
                    return (
                        <div key={`slide-${slide._id}`} className='h-[300px] w-full'>
                            <span className='relative h-[300px] flex flex-col'>
                            <NextImage src={slide.image} fill  sizes="(max-width:600px) 80vw, (max-width:1200px) 20vw" alt={`Cover Image of ${slide.name}`} className='rounded shadow' style={{
                                objectFit: 'cover'
                            }}>

                            </NextImage>
                            <div className='flex flex-col flex-1 justify-end items-center z-10 text-foreground'>
                                <div className='flex flex-col items-center justify-center p-2 gap-2 slider-txt-cont w-full'>
                                <span className='font-bold text-foreground text-shadow'>
                                    {slide.name}
                                </span>
                                <StarsOnly rating={slide.avgRating ? slide.avgRating : 0}></StarsOnly>
                                <div>
                                <Button variant='solid' color='default' size='sm' radius='sm'>Read</Button>
                                </div>
                                </div>
                            </div>
                            </span>
                            
                        </div>
                    )
                })}
            </Slider>
        </div>
    )

}