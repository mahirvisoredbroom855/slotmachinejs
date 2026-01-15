#!/usr/bin/perl
use strict;
use warnings;
use JSON;

# Spin Analysis Tool - Analyzes JSON export files
# Usage: perl analyze_spins.pl export.json

if (@ARGV != 1) {
    die "Usage: perl analyze_spins.pl <export.json>\n";
}

my $input_file = $ARGV[0];

# Read and parse JSON
open(my $fh, '<', $input_file) or die "Cannot open $input_file: $!";
my $json_text = do { local $/; <$fh> };
close($fh);

my $data = decode_json($json_text);
my @spins = @{$data->{spins}};

# Initialize counters
my $total_spins = scalar(@spins);
my $total_wagered = 0;
my $total_won = 0;
my $wins = 0;
my $losses = 0;
my %symbol_frequency;
my %payout_distribution;
my @win_streaks;
my @loss_streaks;
my $current_streak = 0;
my $streak_type = '';

# Analyze each spin
foreach my $spin (@spins) {
    $total_wagered += $spin->{totalBet};
    $total_won += $spin->{winnings};
    
    if ($spin->{winnings} > 0) {
        $wins++;
        
        # Track win streaks
        if ($streak_type eq 'win') {
            $current_streak++;
        } else {
            push @loss_streaks, $current_streak if $current_streak > 0;
            $current_streak = 1;
            $streak_type = 'win';
        }
    } else {
        $losses++;
        
        # Track loss streaks
        if ($streak_type eq 'loss') {
            $current_streak++;
        } else {
            push @win_streaks, $current_streak if $current_streak > 0;
            $current_streak = 1;
            $streak_type = 'loss';
        }
    }
    
    # Payout distribution
    my $payout = $spin->{winnings};
    $payout_distribution{$payout}++;
}

# Finalize streaks
if ($streak_type eq 'win') {
    push @win_streaks, $current_streak;
} else {
    push @loss_streaks, $current_streak;
}

# Calculate statistics
my $win_rate = ($wins / $total_spins) * 100;
my $net_profit = $total_won - $total_wagered;
my $roi = ($total_wagered > 0) ? (($net_profit / $total_wagered) * 100) : 0;
my $avg_bet = $total_wagered / $total_spins;
my $avg_win = ($wins > 0) ? ($total_won / $wins) : 0;

# Find max streaks
my $max_win_streak = @win_streaks ? (sort { $b <=> $a } @win_streaks)[0] : 0;
my $max_loss_streak = @loss_streaks ? (sort { $b <=> $a } @loss_streaks)[0] : 0;

# Print report
print "\n";
print "=" x 60 . "\n";
print "          SLOTLAB SPIN ANALYSIS REPORT\n";
print "=" x 60 . "\n";
print "\n";

print "📊 OVERALL STATISTICS\n";
print "-" x 60 . "\n";
printf "Total Spins:           %d\n", $total_spins;
printf "Total Wagered:         \$%.2f\n", $total_wagered;
printf "Total Won:             \$%.2f\n", $total_won;
printf "Net Profit/Loss:       \$%.2f\n", $net_profit;
printf "ROI:                   %.2f%%\n", $roi;
printf "Average Bet:           \$%.2f\n", $avg_bet;
print "\n";

print "🎯 WIN/LOSS STATISTICS\n";
print "-" x 60 . "\n";
printf "Wins:                  %d (%.2f%%)\n", $wins, $win_rate;
printf "Losses:                %d (%.2f%%)\n", $losses, 100 - $win_rate;
printf "Average Win Amount:    \$%.2f\n", $avg_win;
print "\n";

print "🔥 STREAK ANALYSIS\n";
print "-" x 60 . "\n";
printf "Longest Win Streak:    %d spins\n", $max_win_streak;
printf "Longest Loss Streak:   %d spins\n", $max_loss_streak;
printf "Total Win Streaks:     %d\n", scalar(@win_streaks);
printf "Total Loss Streaks:    %d\n", scalar(@loss_streaks);
print "\n";

print "💰 TOP PAYOUTS\n";
print "-" x 60 . "\n";
my @sorted_payouts = sort { $b <=> $a } keys %payout_distribution;
my $count = 0;
foreach my $payout (@sorted_payouts) {
    last if $count++ >= 10 || $payout == 0;
    printf "\$%-8.2f: %d times (%.2f%%)\n", 
        $payout, 
        $payout_distribution{$payout},
        ($payout_distribution{$payout} / $total_spins) * 100;
}
print "\n";

# Risk assessment
print "⚠️  RISK ASSESSMENT\n";
print "-" x 60 . "\n";
if ($roi < -20) {
    print "Status: HIGH RISK - Significant losses detected\n";
} elsif ($roi < 0) {
    print "Status: MODERATE RISK - Negative ROI\n";
} elsif ($roi < 10) {
    print "Status: LOW RISK - Slight profit\n";
} else {
    print "Status: PROFITABLE - Positive ROI\n";
}

if ($max_loss_streak > 10) {
    print "Warning: Long loss streaks detected (>10 spins)\n";
}

if ($win_rate < 30) {
    print "Notice: Low win rate (<30%)\n";
}

print "\n";
print "=" x 60 . "\n";
print "Report generated: " . localtime() . "\n";
print "=" x 60 . "\n";
print "\n";