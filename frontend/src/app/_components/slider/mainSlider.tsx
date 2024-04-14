'use client'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState } from 'react'
import NextImage from 'next/image'
import { Button, Link } from '@nextui-org/react'
import StarsOnly from '../rating/starsDisplayOnly'
import { GoDotFill } from 'react-icons/go'

interface MainDynamicSlideProps {
    slideArr: []
}

export default function MainDynamicSlide ({slideArr}:MainDynamicSlideProps) {

    const [slides, setSlides] = useState<any[]>(slideArr)

    const settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        dots:true,
        autoplay: false,
        autoplaySpeed: 3000,
        speed:500,
        arrows: true,
        initialSlide: 0,
        pauseonHover: true,
        lazyLoad: true,
        className: 'w-[100%] p-2',
        appendDots: (dots:any) => (
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
        dotsClass: 'slider-dots',
                    
        responsive: [
            {
                breakpoint:1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots:true,
                    autoplay: false,
                    autoplaySpeed: 3000,
                    speed:500,
                    arrows: false,
                    pauseonHover: true,
                    lazyLoad:true,
                    className: 'w-[100%] p-2',
                    appendDots: (dots:any) => (
                        <div style={{

                        }}>
                            <ul>{dots}</ul>

                        </div>
                    ),
                    customPaging: (i:any) => (
                        <GoDotFill>
                            {i + 1}
                        </GoDotFill>
                    ),
                    dotsClass: 'slider-dots'
                    
                    
                    
                    
                }
            },
            {
                breakpoint:640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots:true,
                    autoplay: false,
                    autoplaySpeed: 3000,
                    speed:500,
                    arrows: false,
                    pauseonHover: true,
                    lazyLoad:true,
                    className: 'w-[100%] p-2',
                    appendDots: (dots:any) => (
                        <div style={{

                        }}>
                            <ul>{dots}</ul>

                        </div>
                    ),
                    customPaging: (i:any) => (
                        <GoDotFill>
                            {i + 1}
                        </GoDotFill>
                    ),
                    dotsClass: 'slider-dots'
                    
                    
                    
                    
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
                    lazyLoad: true,
                    className: 'w-[100%] p-2',
                    appendDots: (dots:any) => (
                        <div style={{

                        }}>
                            <ul>{dots}</ul>

                        </div>
                    ),
                    customPaging: (i:any) => (
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
                {slides.map((slide, idx) => {
                    const concatGenres = slide.genres.map((genre:any) => genre.name).sort().join(', ')
                    return (
                        <div key={`slide-${slide._id}`} className='h-[400px] w-full'>
                            <span className='relative h-[400px] flex flex-col lg:m-2 sm:m-2 md:m-2'>
                            <NextImage src={slide.image} fill  sizes="(max-width:320px) 80vw, (max-width:640px) 80vw, (max-width:768px) 30vw, (max-width:1200px) 15vw, 10vw" placeholder='blur' blurDataURL={slide.image} alt={`Cover Image of ${slide.name}`} className='rounded shadow slider-img' style={{
                                objectFit: 'cover'
                            }}>

                            </NextImage>
                            <div className='flex flex-col flex-1 justify-end items-center z-10 text-foreground slider-ol'>
                                <div className='flex flex-col p-2 gap-2 w-full'>
                                    <div className='flex justify-start'>
                                <span className='font-bold text-content2 text-start'>
                                    {slide.name}
                                </span>
                                </div>
                                <StarsOnly isOnCard={true} rating={slide.avgRating ? slide.avgRating : 0}></StarsOnly>
                                <span className='flex text-xs text-content2 font-semibold slider-txt'>
                                    {`Genres: ${concatGenres}`}
                                </span>
                                <span className='text-xs font-semibold slider-about text-content2'>
                                    <p>
                                    {slide.about}
                                    </p>
                                </span>
                                <div className='pb-2 mt-2 flex justify-center'>
                                <Button variant='solid' color='default' size='sm' radius='sm' as={Link} href={`/read/${slide.slug}`}>More Details</Button>
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