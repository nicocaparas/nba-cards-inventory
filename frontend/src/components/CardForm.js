function CardForm({ formData, setFormData, handleSubmit, isEditMode, setEditingCard }) {
    return (
        <form
            onSubmit={handleSubmit}
            className="relative mb-10 p-8 border rounded-lg shadow-lg grid gap-6 max-w-2xl mx-auto bg-white"
        >
            {/* Only show X button if isEditMode is true */}
            {isEditMode && (
                <button
                    type="button"
                    onClick={() => setEditingCard(null)}
                    className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
                >
                    ×
                </button>
            )}

            {/* Player Info */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Player Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Player Name"
                        value={formData.playerName}
                        onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        className="border p-2 rounded"
                        required
                    />
                </div>

                {/* Rookie Checkbox */}
                <div className="mt-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isRookie}
                            onChange={(e) => setFormData({ ...formData, isRookie: e.target.checked })}
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
                        value={formData.cardBrand}
                        onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Variant"
                        value={formData.variant}
                        onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
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
                            checked={formData.isGraded}
                            onChange={(e) => setFormData({ ...formData, isGraded: e.target.checked })}
                        /> Graded
                    </label>
                </div>
                {formData.isGraded && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Grading Info</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <select
                                value={formData.grader}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    grader: e.target.value.trim() === '' ? null : e.target.value.trim() })}
                                className="border p-2 rounded"
                            >
                                <option value="">Select Grader</option>
                                <option value="PSA">PSA</option>
                                <option value="BGS">BGS</option>
                            </select>

                            <select
                                value={formData.grade}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    grade: e.target.value === '' ? null : parseFloat(e.target.value) })}
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
                    value={formData.acquirePrice}
                    onChange={(e) => setFormData({ ...formData, acquirePrice: parseFloat(e.target.value) })}
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
                    {isEditMode ? 'Save Changes' : 'Add Card'}
                </button>
            </div>
        </form>
    );
}

export default CardForm;
