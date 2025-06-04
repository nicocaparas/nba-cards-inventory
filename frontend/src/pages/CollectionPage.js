function CollectionPage({ cards, handleDelete, editVisibleId, toggleEdit }) {
    return (
        <div>
            {/* Card List */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
                    📚 Your Collection
                </h2>

                <div className="flex flex-col gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="flex items-center justify-between border border-gray-300 p-4 rounded-2xl shadow-md bg-white hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                        >
                            {/* Player Name + RC */}
                            <div className="flex items-center gap-2 w-1/5 font-bold">
                                {card.playerName}
                                {card.isRookie && (
                                    <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                                        RC
                                    </span>
                                )}
                            </div>

                            {/* Year + Brand */}
                            <div className="w-1/5 text-gray-600">{card.year} {card.cardBrand}</div>

                            {/* Variant */}
                            <div className="w-1/5 text-gray-500">{card.variant || "-"}</div>

                            {/* Grader + Grade */}
                            <div className="w-1/5 text-sm">
                                {card.isGraded ? (
                                    <>{card.grader} {card.grade}</>
                                ) : (
                                    <>-</>
                                )}
                            </div>

                            {/* Price */}
                            <div className="w-1/12 text-green-600 font-bold">
                                {card.acquirePrice ? `$${card.acquirePrice}` : "—"}
                            </div>

                            {/* Edit Icon */}
                            <div className="flex items-center justify-end gap-2 w-1/12">
                                {editVisibleId === card.id && (
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition font-semibold"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    onClick={() => toggleEdit(card.id)}
                                    className="transform hover:scale-125 transition-all duration-200"
                                >
                                    ✏️
                                </button>
                            </div>

                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}

export default CollectionPage;
  