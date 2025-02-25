import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    guestContact: { type: String, required: true }, // Guest contact number
    guestAddress: { type: String, required: true }, // Guest address
    guestIdNumber: { type: String, required: true }, // Guest ID number
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Reference to Room model
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    additionalServices: { type: Number, default: 0 }, // Extra charges manually added
    totalAmount: { type: Number, required: true }, // Auto-calculated
    amountPaid: { type: Number, default: 0 }, // Payment received
    balanceDue: { type: Number, default: 0 }, // Outstanding balance
    status: { type: String, enum: ['Paid', 'Partially Paid', 'Pending'], default: 'Pending' },
}, { timestamps: true });

ReservationSchema.pre('save', async function(next) {
    const room = await mongoose.model('Room').findById(this.room);
    if (!room) {
        return next(new Error('Room not found'));
    }

    const nightsStayed = Math.ceil((this.checkOutDate - this.checkInDate) / (1000 * 60 * 60 * 24));
    this.totalAmount = (room.price * nightsStayed) + this.additionalServices;
    this.balanceDue = this.totalAmount - this.amountPaid;
    this.status = this.balanceDue === 0 ? 'Paid' : (this.amountPaid > 0 ? 'Partially Paid' : 'Pending');
    next();
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
export default Reservation;
