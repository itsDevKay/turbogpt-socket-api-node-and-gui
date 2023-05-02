
export default function CardHeader({ title, subtitle, subtitleHrefText, subtitleHref }) {
    return (
        <>
            <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
                { title }
            </div>
            { (!subtitle && subtitleHrefText && subtitleHref) && 
                <a href={`${ subtitleHref }`} className="pl-1 text-sm text-blue-500 underline hover:text-blue-700">
                    { subtitleHrefText }
                </a>
            }
            { (subtitle) &&
                <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
                    { subtitle }
                    { (subtitleHrefText && subtitleHref) &&
                        <a href={`${ subtitleHref }`} className="pl-1 text-sm text-blue-500 underline hover:text-blue-700">
                            { subtitleHrefText }
                        </a>
                    }
                </span>
            }
        </>
    )
}