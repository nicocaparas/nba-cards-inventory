function AddCardPage({ newCard, setNewCard, handleAddCard }) {
    return (
        <div>
            {/* Form to add new cards */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
                    ➕ Add New Card
                </h2>
                <form
                    onSubmit={handleAddCard}
                    className="mb-10 p-8 border rounded-lg shadow-lg grid gap-6 max-w-2xl mx-auto bg-white"
                >
                    {/* Player Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Player Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Player Name"
                                value={newCard.playerName}
                                onChange={(e) => setNewCard({ ...newCard, playerName: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Year"
                                value={newCard.year}
                                onChange={(e) => setNewCard({ ...newCard, year: parseInt(e.target.value) })}
                                className="border p-2 rounded"
                                required
                            />
                        </div>

                        {/* Rookie Checkbox — add it below the grid for better flow */}
                        <div className="mt-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newCard.isRookie}
                                    onChange={(e) => setNewCard({ ...newCard, isRookie: e.target.checked })}
                                />
                                Rookie Card
                            </label>
                        </div>
                    </div>


                    {/* Card Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Card Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Card Brand"
                                value={newCard.cardBrand}
                                onChange={(e) => setNewCard({ ...newCard, cardBrand: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Variant"
                                value={newCard.variant}
                                onChange={(e) => setNewCard({ ...newCard, variant: e.target.value })}
                                className="border p-2 rounded"
                            />
                        </div>
                    </div>

                    {/* Grading Info */}
                    <div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newCard.isGraded}
                                    onChange={(e) => setNewCard({ ...newCard, isGraded: e.target.checked })}
                                /> Graded
                            </label>
                        </div>
                        {newCard.isGraded && (
                            <div className="mt-4">
                                {/* Move the title OUTSIDE the grid */}
                                <h3 className="text-lg font-semibold mb-2">Grading Info</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Grader Dropdown */}
                                    <select
                                        value={newCard.grader}
                                        onChange={(e) => setNewCard({ ...newCard, grader: e.target.value })}
                                        className="border p-2 rounded"
                                    >
                                        <option value="">Select Grader</option>
                                        <option value="PSA">PSA</option>
                                        <option value="BGS">BGS</option>
                                    </select>

                                    {/* Grade Dropdown */}
                                    <select
                                        value={newCard.grade}
                                        onChange={(e) => setNewCard({ ...newCard, grade: parseFloat(e.target.value) })}
                                        className="border p-2 rounded"
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="10">10</option>
                                        <option value="9.5">9.5</option>
                                        <option value="9">9</option>
                                        <option value="8.5">8.5</option>
                                        <option value="8">8</option>
                                        <option value="7.5">7.5</option>
                                        <option value="7">7</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Pricing Info</h3>
                        <input
                            type="number"
                            placeholder="Acquire Price"
                            value={newCard.acquirePrice}
                            onChange={(e) => setNewCard({ ...newCard, acquirePrice: parseFloat(e.target.value) })}
                            className="border p-2 rounded"
                            step="0.01"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 text-lg font-semibold shadow-md"
                        >
                            Add Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCardPage;
  