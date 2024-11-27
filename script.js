
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/reservations', // Backend endpoint for events
    });
    calendar.render();

    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            alert('Reserva creada exitosamente!');
            calendar.refetchEvents(); // Refresh calendar
        } else {
            alert('Error al crear la reserva.');
        }
    });
});
