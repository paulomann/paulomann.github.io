from datetime import datetime, timedelta
from dateutil import rrule
import locale

# Set locale for Portuguese date formatting
locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')

def generate_schedule(start_date_str, end_date_str, class_days):
    """
    Generate HTML table for class schedule with UFRJ styling
    
    Parameters:
    - start_date_str: "DD/MM/YYYY"
    - end_date_str: "DD/MM/YYYY"
    - class_days: list of weekday numbers (0=Segunda, 1=Terça,...)
    
    Returns: HTML string with styled schedule table
    """
    # Convert date strings to datetime objects
    start_date = datetime.strptime(start_date_str, "%d/%m/%Y")
    end_date = datetime.strptime(end_date_str, "%d/%m/%Y")
    
    # Generate class dates
    class_dates = list(rrule.rrule(
        rrule.WEEKLY,
        byweekday=class_days,
        dtstart=start_date,
        until=end_date
    ))
    
    # Generate HTML table
    html = f"""
    <div class="ufrj-schedule">
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Leituras</th>
                    <th>Conteúdo</th>
                    <th>Material</th>
                </tr>
            </thead>
            <tbody>
    """
    
    for i, date in enumerate(class_dates, 1):
        html += f"""
                <tr>
                    <td>{date.strftime('%a %d/%m').title()}</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        """
    
    html += """
            </tbody>
        </table>
    </div>
    """
    
    return html

# Example usage
html_output = generate_schedule(
    start_date_str="04/08/2025",
    end_date_str="20/12/2025",
    class_days=[1, 3],  # Terça (1) e Quinta (3)
)

print(html_output)