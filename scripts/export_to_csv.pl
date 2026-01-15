#!/usr/bin/perl
use strict;
use warnings;
use JSON;

# CSV Export Generator for SlotLab
# Usage: perl export_to_csv.pl input.json output.csv

if (@ARGV != 2) {
    die "Usage: perl export_to_csv.pl <input.json> <output.csv>\n";
}

my ($input_file, $output_file) = @ARGV;

# Read JSON file
open(my $fh, '<', $input_file) or die "Cannot open $input_file: $!";
my $json_text = do { local $/; <$fh> };
close($fh);

my $data = decode_json($json_text);
my @spins = @{$data->{spins}};

# Open CSV for writing
open(my $csv, '>', $output_file) or die "Cannot write to $output_file: $!";

# Write CSV header
print $csv "Timestamp,Lines,Bet Per Line,Total Bet,Winnings,Net,Balance After,Result\n";

# Write each spin
foreach my $spin (@spins) {
    my $result = $spin->{winnings} > 0 ? 'WIN' : 'LOSS';
    
    printf $csv "%s,%d,%.2f,%.2f,%.2f,%.2f,%.2f,%s\n",
        $spin->{createdAt},
        $spin->{lines},
        $spin->{betPerLine},
        $spin->{totalBet},
        $spin->{winnings},
        $spin->{net},
        $spin->{balanceAfter},
        $result;
}

close($csv);

print "✅ Exported " . scalar(@spins) . " spins to $output_file\n";