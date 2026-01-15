#!/usr/bin/perl
use strict;
use warnings;
use JSON;

# Compare two SlotLab session exports
# Usage: perl compare_sessions.pl session1.json session2.json

if (@ARGV != 2) {
    die "Usage: perl compare_sessions.pl <session1.json> <session2.json>\n";
}

sub analyze_session {
    my ($file) = @_;
    
    open(my $fh, '<', $file) or die "Cannot open $file: $!";
    my $json_text = do { local $/; <$fh> };
    close($fh);
    
    my $data = decode_json($json_text);
    my @spins = @{$data->{spins}};
    
    my %stats;
    $stats{spins} = scalar(@spins);
    $stats{wagered} = 0;
    $stats{won} = 0;
    $stats{wins} = 0;
    
    foreach my $spin (@spins) {
        $stats{wagered} += $spin->{totalBet};
        $stats{won} += $spin->{winnings};
        $stats{wins}++ if $spin->{winnings} > 0;
    }
    
    $stats{net} = $stats{won} - $stats{wagered};
    $stats{roi} = ($stats{wagered} > 0) ? (($stats{net} / $stats{wagered}) * 100) : 0;
    $stats{win_rate} = ($stats{spins} > 0) ? (($stats{wins} / $stats{spins}) * 100) : 0;
    
    return \%stats;
}

my $session1 = analyze_session($ARGV[0]);
my $session2 = analyze_session($ARGV[1]);

# Print comparison
print "\n";
print "=" x 70 . "\n";
print "              SESSION COMPARISON REPORT\n";
print "=" x 70 . "\n";
print "\n";

printf "%-25s %20s %20s\n", "Metric", "Session 1", "Session 2";
print "-" x 70 . "\n";

printf "%-25s %20d %20d\n", "Total Spins", $session1->{spins}, $session2->{spins};
printf "%-25s %19.2f %19.2f\n", "Total Wagered (\$)", $session1->{wagered}, $session2->{wagered};
printf "%-25s %19.2f %19.2f\n", "Total Won (\$)", $session1->{won}, $session2->{won};
printf "%-25s %19.2f %19.2f\n", "Net Profit (\$)", $session1->{net}, $session2->{net};
printf "%-25s %18.2f%% %18.2f%%\n", "ROI", $session1->{roi}, $session2->{roi};
printf "%-25s %18.2f%% %18.2f%%\n", "Win Rate", $session1->{win_rate}, $session2->{win_rate};

print "\n";
print "📈 IMPROVEMENTS/CHANGES\n";
print "-" x 70 . "\n";

my $spin_change = $session2->{spins} - $session1->{spins};
my $roi_change = $session2->{roi} - $session1->{roi};
my $winrate_change = $session2->{win_rate} - $session1->{win_rate};

printf "Spin Count Change:     %+d\n", $spin_change;
printf "ROI Change:            %+.2f%%\n", $roi_change;
printf "Win Rate Change:       %+.2f%%\n", $winrate_change;

print "\n";
print "=" x 70 . "\n";
print "\n";