

const generateRandomName = () => {
    const names = [
        'Cat',
        'Dog',
        'Tiger',
        'Lion',
        'Elephant',
        'Racoon',
        'Giraffe',
        'Mouse',
        'Wolf',
        'Human'
    ]

    const adj = [
        'Cute',
        'Angry',
        'Sad',
        'Happy',
        'Emo',
        'Gigachad'
    ]

    const randomNum = Math.floor(Math.random() * 10000)
    const paddedNum = randomNum.toString().padStart(4, "0")
    const adjIndex = Math.floor(Math.random() * adj.length)
    const nameIndex = Math.floor(Math.random() * names.length)

    const randomName = `${adj[adjIndex]}${names[nameIndex]}${paddedNum}`

    return randomName


}


export { generateRandomName }