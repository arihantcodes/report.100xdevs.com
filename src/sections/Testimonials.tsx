import ClientTweetCard from "@/components/magictweet";

export async function TweetDemo() {
    const tweetIds = [
        "1710901887849918850",
        "1818634807489741020",
        "1789508919645065547",
        "1796790102179360825",
        "1804108390911922574",
        "1793628910040854795",
        "1805677333350957154",
        "1819706444427481151"
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 p-4">
        {tweetIds.map((id, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                <ClientTweetCard id={id} className="shadow-2xl w-full" />
            </div>
        ))}
    </div>
    );
}