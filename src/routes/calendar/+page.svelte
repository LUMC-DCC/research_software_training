<script lang="ts">
	import { events } from '$lib/data';

	const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	type CellType = 'prev' | 'current' | 'next';

	const now = new Date();
	let viewYear = $state(now.getFullYear());
	let viewMonth = $state(now.getMonth());

	const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
	const getFirstDayOfMonth = (y: number, m: number) => {
		const day = new Date(y, m, 1).getDay();
		return day === 0 ? 6 : day - 1;
	};

	type CalendarCell = { day: number; type: CellType; fullDate: Date };

	const calendarCells = $derived.by(() => {
		const y = viewYear;
		const m = viewMonth;
		const daysInMonth = getDaysInMonth(y, m);
		const startingDayIndex = getFirstDayOfMonth(y, m);
		const daysInPrevMonth = getDaysInMonth(y, m - 1);
		const cells: CalendarCell[] = [];

		for (let i = 0; i < startingDayIndex; i += 1) {
			const day = daysInPrevMonth - startingDayIndex + i + 1;
			cells.push({ day, type: 'prev', fullDate: new Date(y, m - 1, day) });
		}

		for (let i = 1; i <= daysInMonth; i += 1) {
			cells.push({ day: i, type: 'current', fullDate: new Date(y, m, i) });
		}

		const remainingCells = 42 - cells.length;
		for (let i = 1; i <= remainingCells; i += 1) {
			cells.push({ day: i, type: 'next', fullDate: new Date(y, m + 1, i) });
		}

		return cells;
	});

	const monthLabel = $derived(
		new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);

	const getEventsForDay = (date: Date) =>
		events.filter((event) => {
			const eDate = new Date(event.date);
			return (
				eDate.getDate() === date.getDate() &&
				eDate.getMonth() === date.getMonth() &&
				eDate.getFullYear() === date.getFullYear()
			);
		});

	const nextMonth = () => {
		if (viewMonth === 11) {
			viewMonth = 0;
			viewYear += 1;
			return;
		}
		viewMonth += 1;
	};

	const prevMonth = () => {
		if (viewMonth === 0) {
			viewMonth = 11;
			viewYear -= 1;
			return;
		}
		viewMonth -= 1;
	};

	const goToToday = () => {
		viewYear = now.getFullYear();
		viewMonth = now.getMonth();
	};

	const isToday = (date: Date) => new Date().toDateString() === date.toDateString();
</script>

<div class="wrap">
	<div class="container">
		<div class="head">
			<h1>Training Calendar</h1>
			<div class="controls">
				<button type="button" onclick={prevMonth}>Prev</button>
				<div class="month">{monthLabel}</div>
				<button type="button" onclick={nextMonth}>Next</button>
			</div>
			<button type="button" class="today" onclick={goToToday}>Today</button>
		</div>

		<div class="legend">
			<span><i class="dot training"></i>Training</span>
			<span><i class="dot cafe"></i>Coding Cafe</span>
		</div>

		<div class="calendar">
			<div class="weekdays">
				{#each DAYS_OF_WEEK as day}
					<div>{day}</div>
				{/each}
			</div>

			<div class="grid">
				{#each calendarCells as cell, idx}
					<div class={cell.type === 'current' ? 'cell current' : 'cell muted'} data-last-col={idx % 7 === 6}>
						<div class="day">
							<span class:today={isToday(cell.fullDate)}>{cell.day}</span>
						</div>
						<div class="events">
							{#each getEventsForDay(cell.fullDate) as event (event.id)}
								<div class={event.type === 'cafe' ? 'event cafe' : 'event training'}>
									<div class="title">{event.title}</div>
									<div class="time">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		min-height: 100%;
		background: #f8fafc;
		padding: 3rem 0;
	}
	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.head {
		display: grid;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	h1 {
		margin: 0;
		font-size: 2rem;
		color: #0f172a;
	}
	.controls {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.45rem;
		padding: 0.25rem;
		width: fit-content;
	}
	.controls button,
	.today {
		border: 0;
		background: transparent;
		padding: 0.45rem 0.65rem;
		font-weight: 600;
		color: #334155;
		border-radius: 0.35rem;
	}
	.controls button:hover,
	.today:hover {
		background: #f1f5f9;
	}
	.month {
		min-width: 10rem;
		text-align: center;
		font-weight: 700;
		color: #1e293b;
	}
	.today {
		border: 1px solid #cbd5e1;
		background: #fff;
		width: fit-content;
	}
	.legend {
		display: flex;
		gap: 1rem;
		font-size: 0.85rem;
		color: #475569;
		margin-bottom: 1rem;
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	.dot {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 999px;
		display: inline-block;
	}
	.dot.training {
		background: #0ea5e9;
	}
	.dot.cafe {
		background: #22c55e;
	}
	.calendar {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.65rem;
		overflow: hidden;
	}
	.weekdays,
	.grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}
	.weekdays {
		background: #f8fafc;
		border-bottom: 1px solid #e2e8f0;
	}
	.weekdays div {
		padding: 0.65rem;
		text-align: center;
		font-size: 0.74rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #334155;
	}
	.cell {
		min-height: 7.3rem;
		padding: 0.5rem;
		border-bottom: 1px solid #f1f5f9;
		border-right: 1px solid #f1f5f9;
	}
	.cell[data-last-col='true'] {
		border-right: 0;
	}
	.cell.muted {
		background: #f8fafc;
		color: #94a3b8;
	}
	.day {
		margin-bottom: 0.35rem;
		display: flex;
		align-items: center;
		min-height: 1.9rem;
	}
	.day span {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 999px;
		font-size: 0.76rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0;
		flex-shrink: 0;
	}
	.day span.today {
		background: #0369a1;
		color: #fff;
	}
	.events {
		display: grid;
		gap: 0.3rem;
	}
	.event {
		padding: 0.25rem 0.4rem;
		border-radius: 0.35rem;
		border-left: 2px solid;
		font-size: 0.66rem;
		line-height: 1.25;
	}
	.event.training {
		background: #f0f9ff;
		color: #0369a1;
		border-left-color: #0ea5e9;
	}
	.event.cafe {
		background: #f0fdf4;
		color: #15803d;
		border-left-color: #22c55e;
	}
	.title {
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.time {
		opacity: 0.8;
		margin-top: 0.1rem;
	}
	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}
		.head {
			grid-template-columns: 1fr auto auto;
			align-items: center;
		}
	}
</style>
