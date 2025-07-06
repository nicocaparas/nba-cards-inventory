import { useState } from 'react';

function CardForm({ formData, setFormData, handleSubmit, isEditMode, setEditingCard }) {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Player Name
        if (!formData.playerName?.trim()) {
            newErrors.playerName = "Player name is required.";
        }

        // Year
        if (
            formData.year === "" ||
            formData.year === null ||
            isNaN(formData.year) ||
            formData.year < 1900 ||
            formData.year > new Date().getFullYear()
        ) {
            newErrors.year = "Year must be between 1900 and this year.";
          }

        // Card Brand
        if (!formData.cardBrand?.trim()) {
            newErrors.cardBrand = "Card brand is required.";
        }

        // Card Number
        if (
            !formData.cardNum?.toString().trim() ||
            isNaN(Number(formData.cardNum))
        ) {
            newErrors.cardNum = "Card number is required and must be a valid number.";
          }

        // Acquire Price (optional, but check if entered)
        if (formData.acquirePrice !== undefined && formData.acquirePrice !== null) {
            if (
                formData.acquirePrice !== "" &&
                (isNaN(formData.acquirePrice) || formData.acquirePrice < 0)
            ) {
                newErrors.acquirePrice = "Acquire price must be a positive number.";
            }
        }

        // Graded Fields (if grading enabled)
        if (formData.isGraded) {
            if (!formData.grader) {
                newErrors.grader = "Select a grader.";
            }
            if (!formData.grade) {
                newErrors.grade = "Select a grade.";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };      

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                if (validateForm()) {
                    handleSubmit(e);
                }
            }}
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
                    />
                    {errors.playerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.playerName}</p>
                    )}
                    <input
                        type="number"
                        placeholder="Year"
                        value={formData.year}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                year:
                                    e.target.value === ""
                                        ? ""
                                        : parseInt(e.target.value, 10),
                            })
                          }
                        className="border p-2 rounded"
                    />
                    {errors.year && (
                        <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                    )}
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
                    />
                    {errors.cardBrand && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardBrand}</p>
                    )}
                    <input
                        type="number"
                        placeholder="Card Number"
                        value={formData.cardNum}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                cardNum:
                                    e.target.value === ""
                                        ? ""
                                        : parseFloat(e.target.value),
                            })
                          }
                        className="border p-2 rounded"
                    />
                    {errors.cardNum && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNum}</p>
                    )}
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
                            {errors.grader && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.grader}
                                </p>
                            )}

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
                            {errors.grade && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.grade}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Info */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Pricing Info</h3>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        placeholder="Acquire Price"
                        value={formData.acquirePrice}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                acquirePrice: e.target.value === "" ? "" : parseFloat(e.target.value),
                            })
                          }
                        className="border p-2 rounded"
                        step="0.01"
                    />
                    {errors.acquirePrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.acquirePrice}</p>
                    )}

                    {/* Track Prices Checkbox */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.trackPrices}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    trackPrices: e.target.checked,
                                })
                            }
                        />
                        Track Prices
                    </label>
                </div>
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
