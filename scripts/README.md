# SlotLab Perl Scripts

Data processing and analysis tools for SlotLab exports.

## Prerequisites

Install required Perl modules:
```bash
# On macOS/Linux
cpan JSON
cpan XML::Simple

# On Ubuntu/Debian
sudo apt-get install libjson-perl libxml-simple-perl

# On Windows (Strawberry Perl)
cpan JSON
cpan XML::Simple
```

## Scripts

### 1. JSON to XML Converter
Convert JSON exports to XML format.
```bash
perl json_to_xml.pl slotlab-export-123.json output.xml
```

### 2. Spin Analyzer
Generate detailed statistics report from export file.
```bash
perl analyze_spins.pl slotlab-export-123.json
```

### 3. CSV Exporter
Convert JSON export to CSV for Excel/Google Sheets.
```bash
perl export_to_csv.pl slotlab-export-123.json spins.csv
```

### 4. Session Comparator
Compare two different gaming sessions.
```bash
perl compare_sessions.pl session1.json session2.json
```

## Usage Example
```bash
# 1. Export data from SlotLab dashboard (JSON format)
# 2. Run analysis
cd scripts
perl analyze_spins.pl ../downloads/slotlab-export-1234567890.json

# 3. Convert to CSV for spreadsheet analysis
perl export_to_csv.pl ../downloads/slotlab-export-1234567890.json analysis.csv

# 4. Convert to XML for legacy systems
perl json_to_xml.pl ../downloads/slotlab-export-1234567890.json archive.xml
```

## Output Examples

**analyze_spins.pl** produces:
- Overall statistics (total spins, ROI, etc.)
- Win/loss breakdown
- Streak analysis
- Top payouts
- Risk assessment

**CSV format** contains:
```
Timestamp,Lines,Bet Per Line,Total Bet,Winnings,Net,Balance After,Result
2025-01-15T10:30:00Z,3,10.00,30.00,60.00,30.00,1030.00,WIN
```