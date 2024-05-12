'use client'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState } from 'react'
import NextImage from 'next/image'
import { Button, Link, Skeleton } from '@nextui-org/react'
import StarsOnly from '../rating/starsDisplayOnly'
import { GoDotFill } from 'react-icons/go'
import { FaPlay } from 'react-icons/fa'
import { Image } from '@nextui-org/react'

interface MainDynamicSlideProps {
    slideArr: []
}

export default function MainDynamicSlide ({slideArr}:MainDynamicSlideProps) {

    const [slides, setSlides] = useState<any[]>(slideArr)
    const [isImgDoneLoading, setIsImgDoneLoading] = useState(false)

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots:true,
        autoplay: true,
        autoplaySpeed: 15000,
        speed:500,
        arrows: false,
        initialSlide: 0,
        pauseonHover: true,
        lazyLoad: false,
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
        dotsClass: 'slider-dots',
                    
        responsive: [
            {
                breakpoint:1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots:true,
                    autoplay: true,
                    autoplaySpeed: 15000,
                    speed:500,
                    arrows: false,
                    initialSlide: 0,
                    pauseonHover: true,
                    lazyLoad: false,
                  
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
                    autoplaySpeed: 15000,
                    speed:500,
                    arrows: false,
                    pauseonHover: true,
                    lazyLoad: false,
                    initialSlide: 0,
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
                    autoplay: true,
                    autoplaySpeed: 15000,
                    speed:500,
                    arrows: false,
                    pauseonHover: true,
                    lazyLoad: false,
                    initialSlide: 0,
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


    } as any

    

    return (
        <div className='slider-container flex items-center justify-center'>
            <Slider {...settings}>
                {slides.map((slide, idx) => {
                    const concatGenres = slide.genres.map((genre:any) => genre.name).sort().join(', ')
                    return (
                        <div key={`slide-${slide._id}`} className='h-[400px] w-full'>
                            <span className='relative h-[400px] flex flex-col lg:m-2 sm:m-2 md:m-2'>
                                 <Skeleton isLoaded={isImgDoneLoading} className='absolute w-full h-full sm:max-w-[300px]'></Skeleton>
                            {/* <NextImage src={slide.image}  fill  sizes="(max-width:640px) 100vw, (max-width:768px) 30vw, (max-width:1200px) 15vw, 15vw" priority={idx === 0}
                            placeholder='blur' blurDataURL={slide.image} alt={`Cover Image of ${slide.name}`} className='rounded shadow slider-img sm:max-w-[300px]' style={{
                                objectFit: 'cover'
                            }}>

                            </NextImage> */}
                        
                            <Image src={slide.image} width={300} height={400} alt={`Cover Image of ${slide.name}`} disableSkeleton shadow='none' onLoad={idx === 0 ? () => setIsImgDoneLoading(true) : undefined} className='sm:p-2 sm:max-w-[300px] slider-img' loading={ idx === 0 ? 'eager' : 'lazy'} classNames={{
                                
                                wrapper: 'static w-full h-full z-100'
                            }} style={{
                               objectFit:'cover',
                               width:'100%',
                               position:'absolute'
                            }}>

                            </Image>
                            <div className='flex flex-col flex-1 justify-end items-center z-10 text-foreground slider-ol sm:l-slider-ol sm:pl-[320px] sm:justify-center sm:shadow'>
                                <div className='flex flex-col p-2 gap-2 w-full'>
                                    <div className=' slider-about'>
                                <span className='font-bold text-content2 text-start lg:text-4xl sm:text-2xl md:text-3xl'>
                                    {slide.name}
                                </span>
                                </div>
                                <StarsOnly isOnCard={true} rating={slide.avgRating ? slide.avgRating : 0}></StarsOnly>
                                <span className='flex text-xs text-content2 font-semibold slider-txt sm:txt-sm'>
                                    {`Genres: ${concatGenres}`}
                                </span>
                                <span className='text-xs font-semibold slider-about lg:l-about text-content2 sm:text-sm'>
                                    <p>
                                    {slide.about}
                                    </p>
                                </span>
                                <div className='pb-2 mt-2 flex justify-center sm:mt-8 sm:pr-4 sm:justify-end'>
                                <Button variant='solid' color='default' size='sm' radius='full' aria-label={`Read ${slide.name}`} as={Link} href={`/read/${slide.slug}`} className=' lg:w-[200px] lg:h-[55px] font-semibold lg:text-base' startContent={<FaPlay></FaPlay>}>Start Reading</Button>
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