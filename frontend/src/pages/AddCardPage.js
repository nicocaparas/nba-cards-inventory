import CardForm from '../components/CardForm';

function AddCardPage({ newCard, setNewCard, handleAddCard }) {
    return (
        <div>
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
                    ➕ Add New Card
                </h2>
                <CardForm
                    formData={newCard}
                    setFormData={setNewCard}
                    handleSubmit={handleAddCard}
                    isEditMode={false}
                />
            </div>
        </div>
    );
}

export default AddCardPage;
