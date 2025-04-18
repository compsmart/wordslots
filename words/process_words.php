<?php
// Set error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$sourceFile = "collins.txt";
$outputFile = "output.txt";
$wordLengthsToKeep = [3, 4, 5];

/**
 * Processes the collins.txt file and extracts word definitions
 * 
 * @param string $sourceFile Source file path
 * @param string $outputFile Output file path
 * @param array $wordLengthsToKeep Array of word lengths to keep
 * @return array Statistics about the processing
 */
function processWords($sourceFile, $outputFile, $wordLengthsToKeep)
{
    $startTime = microtime(true);
    $stats = [
        'total' => 0,
        'processed' => 0,
        'skipped' => 0,
        'byLength' => [],
    ];

    // Initialize word length counters
    foreach ($wordLengthsToKeep as $length) {
        $stats['byLength'][$length] = 0;
    }

    // Check if source file exists
    if (!file_exists($sourceFile)) {
        return ['error' => "Source file $sourceFile not found"];
    }

    // Open files
    $source = fopen($sourceFile, 'r');
    $output = fopen($outputFile, 'w');

    if (!$source || !$output) {
        return ['error' => "Failed to open files for reading/writing"];
    }

    // Process each line
    while (($line = fgets($source)) !== false) {
        $stats['total']++;

        // Parse the line
        if (preg_match('/^(\w+)\s+(.+)\s+\[(\w+).*\]$/', $line, $matches)) {
            $word = trim($matches[1]);
            $definition = trim($matches[2]);
            $type = trim($matches[3]);

            // Fix commonly used abbreviations for word types
            switch ($type) {
                case 'n':
                    $type = 'noun';
                    break;
                case 'v':
                    $type = 'verb';
                    break;
                case 'adj':
                    $type = 'adjective';
                    break;
                case 'adv':
                    $type = 'adverb';
                    break;
                case 'interj':
                    $type = 'interjection';
                    break;
                case 'prep':
                    $type = 'preposition';
                    break;
                case 'conj':
                    $type = 'conjunction';
                    break;
                case 'pron':
                    $type = 'pronoun';
                    break;
                    // Keep other types as they are
            }

            $wordLength = strlen($word);

            // Check if this word length should be kept
            if (in_array($wordLength, $wordLengthsToKeep)) {
                $stats['processed']++;
                $stats['byLength'][$wordLength]++;

                // Format: word: (type) definition
                $formattedLine = "$word: ($type) $definition\n";
                fwrite($output, $formattedLine);
            } else {
                $stats['skipped']++;
            }
        } else {
            // Alternative pattern matching as some entries might have different formats
            if (preg_match('/^(\w+)\s+(.+)$/', $line, $matches)) {
                $word = trim($matches[1]);
                $definition = trim($matches[2]);

                // Try to extract type from definition if it contains brackets
                $type = "unknown";
                if (preg_match('/\[(\w+).*\]/', $definition, $typeMatches)) {
                    $type = $typeMatches[1];
                    // Remove the type part from definition
                    $definition = preg_replace('/\[(\w+).*\]/', '', $definition);
                }

                $wordLength = strlen($word);

                // Check if this word length should be kept
                if (in_array($wordLength, $wordLengthsToKeep)) {
                    $stats['processed']++;
                    $stats['byLength'][$wordLength]++;

                    // Format: word: (type) definition
                    $formattedLine = "$word: ($type) $definition\n";
                    fwrite($output, $formattedLine);
                } else {
                    $stats['skipped']++;
                }
            } else {
                $stats['skipped']++;
            }
        }

        // Update status every 1000 lines
        if ($stats['total'] % 1000 === 0) {
            file_put_contents('process_status.json', json_encode([
                'stats' => $stats,
                'inProgress' => true,
                'timestamp' => time()
            ]));
        }
    }

    // Close files
    fclose($source);
    fclose($output);

    $stats['timeElapsed'] = microtime(true) - $startTime;

    // Final status update
    file_put_contents('process_status.json', json_encode([
        'stats' => $stats,
        'inProgress' => false,
        'timestamp' => time()
    ]));

    return $stats;
}

/**
 * Extracts just the words from collins.txt into a simple word list file
 * 
 * @param string $sourceFile Source file path
 * @param string $outputFile Output file path
 * @param array $wordLengthsToKeep Array of word lengths to keep
 * @return array Statistics about the processing
 */
function extractWordsOnly($sourceFile, $outputFile, $wordLengthsToKeep)
{
    $startTime = microtime(true);
    $stats = [
        'total' => 0,
        'processed' => 0,
        'skipped' => 0,
        'byLength' => [],
    ];

    // Initialize word length counters
    foreach ($wordLengthsToKeep as $length) {
        $stats['byLength'][$length] = 0;
    }

    // Check if source file exists
    if (!file_exists($sourceFile)) {
        return ['error' => "Source file $sourceFile not found"];
    }

    // Open files
    $source = fopen($sourceFile, 'r');
    $output = fopen($outputFile, 'w');

    if (!$source || !$output) {
        return ['error' => "Failed to open files for reading/writing"];
    }

    // Process each line
    while (($line = fgets($source)) !== false) {
        $stats['total']++;

        // Extract just the word (first part of each line)
        if (preg_match('/^(\w+)\s+/', $line, $matches)) {
            $word = trim($matches[1]);
            $wordLength = strlen($word);

            // Check if this word length should be kept
            if (in_array($wordLength, $wordLengthsToKeep)) {
                $stats['processed']++;
                $stats['byLength'][$wordLength]++;

                // Write just the word
                fwrite($output, "$word\n");
            } else {
                $stats['skipped']++;
            }
        } else {
            $stats['skipped']++;
        }

        // Update status every 1000 lines
        if ($stats['total'] % 1000 === 0) {
            file_put_contents('extract_words_status.json', json_encode([
                'stats' => $stats,
                'inProgress' => true,
                'timestamp' => time()
            ]));
        }
    }

    // Close files
    fclose($source);
    fclose($output);

    $stats['timeElapsed'] = microtime(true) - $startTime;

    // Final status update
    file_put_contents('extract_words_status.json', json_encode([
        'stats' => $stats,
        'inProgress' => false,
        'timestamp' => time()
    ]));

    return $stats;
}

// Check if this is an AJAX request
if (isset($_GET['action'])) {
    header('Content-Type: application/json');

    switch ($_GET['action']) {
        case 'start':
            // Start processing
            $stats = processWords($sourceFile, $outputFile, $wordLengthsToKeep);
            echo json_encode(['success' => true, 'stats' => $stats]);
            break;

        case 'extract_words':
            // Extract words only
            $wordsFile = "words.txt";
            $stats = extractWordsOnly($sourceFile, $wordsFile, $wordLengthsToKeep);
            echo json_encode(['success' => true, 'stats' => $stats]);
            break;

        case 'words_status':
            // Get words extraction status
            if (file_exists('extract_words_status.json')) {
                echo file_get_contents('extract_words_status.json');
            } else {
                echo json_encode(['inProgress' => false]);
            }
            break;

        case 'words_preview':
            // Get a preview of the words file
            $lineCount = isset($_GET['lines']) ? (int)$_GET['lines'] : 20;
            $preview = [];
            $wordsFile = "words.txt";

            if (file_exists($wordsFile)) {
                $file = fopen($wordsFile, 'r');
                for ($i = 0; $i < $lineCount && !feof($file); $i++) {
                    $preview[] = fgets($file);
                }
                fclose($file);
            }

            echo json_encode(['preview' => $preview]);
            break;

        case 'status':
            // Get current status
            if (file_exists('process_status.json')) {
                echo file_get_contents('process_status.json');
            } else {
                echo json_encode(['inProgress' => false]);
            }
            break;

        case 'preview':
            // Get a preview of the output file
            $lineCount = isset($_GET['lines']) ? (int)$_GET['lines'] : 10;
            $preview = [];

            if (file_exists($outputFile)) {
                $file = fopen($outputFile, 'r');
                for ($i = 0; $i < $lineCount && !feof($file); $i++) {
                    $preview[] = fgets($file);
                }
                fclose($file);
            }

            echo json_encode(['preview' => $preview]);
            break;

        default:
            echo json_encode(['error' => 'Invalid action']);
    }

    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Word Definition Processor</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f9fc;
        }

        h1,
        h2 {
            color: #2c3e50;
        }

        .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }

        .button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
        }

        .button:hover {
            background-color: #2980b9;
        }

        .button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }

        pre {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 4px;
            overflow: auto;
            border: 1px solid #ddd;
        }

        .progress-container {
            width: 100%;
            background-color: #ecf0f1;
            border-radius: 4px;
            margin: 10px 0;
        }

        .progress-bar {
            height: 20px;
            background-color: #2ecc71;
            border-radius: 4px;
            width: 0%;
            transition: width 0.3s;
            text-align: center;
            color: white;
            font-size: 14px;
            line-height: 20px;
        }

        .stats {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin: 20px 0;
        }

        .stat-box {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 4px;
            flex: 1;
            min-width: 150px;
            text-align: center;
        }

        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }

        .stat-label {
            font-size: 14px;
            color: #7f8c8d;
        }

        #preview-container {
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <h1>Word Definition Processor</h1>
    <div class="container">
        <h2>Process Words</h2>
        <p>This tool extracts 3, 4, and 5-letter words from the Collins dictionary file and reformats them.</p>

        <div class="button-container" style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button id="start-button" class="button">Extract Definitions</button>
            <button id="extract-words-button" class="button">Extract Words Only</button>
        </div>

        <div id="status-container" style="display: none;">
            <p>Processing in progress...</p>
            <div class="progress-container">
                <div id="progress-bar" class="progress-bar">0%</div>
            </div>

            <div class="stats">
                <div class="stat-box">
                    <div id="processed-count" class="stat-value">0</div>
                    <div class="stat-label">Processed Words</div>
                </div>

                <div class="stat-box">
                    <div id="skipped-count" class="stat-value">0</div>
                    <div class="stat-label">Skipped Words</div>
                </div>

                <div class="stat-box">
                    <div id="3-letter-count" class="stat-value">0</div>
                    <div class="stat-label">3-Letter Words</div>
                </div>

                <div class="stat-box">
                    <div id="4-letter-count" class="stat-value">0</div>
                    <div class="stat-label">4-Letter Words</div>
                </div>

                <div class="stat-box">
                    <div id="5-letter-count" class="stat-value">0</div>
                    <div class="stat-label">5-Letter Words</div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <h2>Definitions Output Preview</h2>
        <button id="preview-button" class="button">Show Preview</button>
        <div id="preview-container" style="display: none;">
            <pre id="preview-content"></pre>
        </div>
    </div>

    <div class="container">
        <h2>Words Only Output Preview</h2>
        <button id="words-preview-button" class="button">Show Words Preview</button>
        <div id="words-preview-container" style="display: none;">
            <pre id="words-preview-content"></pre>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const startButton = document.getElementById('start-button');
            const extractWordsButton = document.getElementById('extract-words-button');
            const previewButton = document.getElementById('preview-button');
            const wordsPreviewButton = document.getElementById('words-preview-button');
            const statusContainer = document.getElementById('status-container');
            const progressBar = document.getElementById('progress-bar');
            const previewContainer = document.getElementById('preview-container');
            const previewContent = document.getElementById('preview-content');
            const wordsPreviewContainer = document.getElementById('words-preview-container');
            const wordsPreviewContent = document.getElementById('words-preview-content');

            // Check status on page load
            checkStatus();
            checkWordsStatus();

            startButton.addEventListener('click', function() {
                startProcessing();
            });

            extractWordsButton.addEventListener('click', function() {
                extractWords();
            });

            previewButton.addEventListener('click', function() {
                showPreview();
            });

            wordsPreviewButton.addEventListener('click', function() {
                showWordsPreview();
            });

            function startProcessing() {
                startButton.disabled = true;
                extractWordsButton.disabled = true;
                statusContainer.style.display = 'block';

                fetch('process_words.php?action=start')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            checkStatus();
                        } else {
                            alert('Error: ' + (data.error || 'Unknown error'));
                            startButton.disabled = false;
                            extractWordsButton.disabled = false;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error starting process. Check console for details.');
                        startButton.disabled = false;
                        extractWordsButton.disabled = false;
                    });
            }

            function extractWords() {
                startButton.disabled = true;
                extractWordsButton.disabled = true;
                statusContainer.style.display = 'block';

                fetch('process_words.php?action=extract_words')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            checkWordsStatus();
                        } else {
                            alert('Error: ' + (data.error || 'Unknown error'));
                            startButton.disabled = false;
                            extractWordsButton.disabled = false;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error extracting words. Check console for details.');
                        startButton.disabled = false;
                        extractWordsButton.disabled = false;
                    });
            }

            function checkStatus() {
                fetch('process_words.php?action=status')
                    .then(response => response.json())
                    .then(data => {
                        if (data.inProgress) {
                            statusContainer.style.display = 'block';
                            startButton.disabled = true;
                            extractWordsButton.disabled = true;

                            // Update stats
                            const stats = data.stats;
                            if (stats) {
                                document.getElementById('processed-count').textContent = stats.processed.toLocaleString();
                                document.getElementById('skipped-count').textContent = stats.skipped.toLocaleString();

                                // Update word length counts
                                if (stats.byLength) {
                                    for (const length in stats.byLength) {
                                        const element = document.getElementById(`${length}-letter-count`);
                                        if (element) {
                                            element.textContent = stats.byLength[length].toLocaleString();
                                        }
                                    }
                                }

                                // Update progress bar if we have total info
                                if (stats.total > 0) {
                                    const percentage = Math.round((stats.processed + stats.skipped) / stats.total * 100);
                                    progressBar.style.width = `${percentage}%`;
                                    progressBar.textContent = `${percentage}%`;
                                }
                            }

                            // Keep checking status
                            setTimeout(checkStatus, 1000);
                        } else {
                            if (data.stats) {
                                // Final update of stats
                                document.getElementById('processed-count').textContent = data.stats.processed.toLocaleString();
                                document.getElementById('skipped-count').textContent = data.stats.skipped.toLocaleString();

                                // Update word length counts
                                if (data.stats.byLength) {
                                    for (const length in data.stats.byLength) {
                                        const element = document.getElementById(`${length}-letter-count`);
                                        if (element) {
                                            element.textContent = data.stats.byLength[length].toLocaleString();
                                        }
                                    }
                                }

                                // Complete progress bar
                                progressBar.style.width = '100%';
                                progressBar.textContent = '100%';
                            }

                            // Enable buttons again
                            startButton.disabled = false;
                            extractWordsButton.disabled = false;
                        }
                    })
                    .catch(error => {
                        console.error('Error checking status:', error);
                        startButton.disabled = false;
                        extractWordsButton.disabled = false;
                    });
            }

            function checkWordsStatus() {
                fetch('process_words.php?action=words_status')
                    .then(response => response.json())
                    .then(data => {
                        if (data.inProgress) {
                            statusContainer.style.display = 'block';
                            startButton.disabled = true;
                            extractWordsButton.disabled = true;

                            // Update stats
                            const stats = data.stats;
                            if (stats) {
                                document.getElementById('processed-count').textContent = stats.processed.toLocaleString();
                                document.getElementById('skipped-count').textContent = stats.skipped.toLocaleString();

                                // Update word length counts
                                if (stats.byLength) {
                                    for (const length in stats.byLength) {
                                        const element = document.getElementById(`${length}-letter-count`);
                                        if (element) {
                                            element.textContent = stats.byLength[length].toLocaleString();
                                        }
                                    }
                                }

                                // Update progress bar if we have total info
                                if (stats.total > 0) {
                                    const percentage = Math.round((stats.processed + stats.skipped) / stats.total * 100);
                                    progressBar.style.width = `${percentage}%`;
                                    progressBar.textContent = `${percentage}%`;
                                }
                            }

                            // Keep checking status
                            setTimeout(checkWordsStatus, 1000);
                        } else {
                            if (data.stats) {
                                // Final update of stats
                                document.getElementById('processed-count').textContent = data.stats.processed.toLocaleString();
                                document.getElementById('skipped-count').textContent = data.stats.skipped.toLocaleString();

                                // Update word length counts
                                if (data.stats.byLength) {
                                    for (const length in data.stats.byLength) {
                                        const element = document.getElementById(`${length}-letter-count`);
                                        if (element) {
                                            element.textContent = data.stats.byLength[length].toLocaleString();
                                        }
                                    }
                                }

                                // Complete progress bar
                                progressBar.style.width = '100%';
                                progressBar.textContent = '100%';
                            }

                            // Enable buttons again
                            startButton.disabled = false;
                            extractWordsButton.disabled = false;
                        }
                    })
                    .catch(error => {
                        console.error('Error checking words status:', error);
                        startButton.disabled = false;
                        extractWordsButton.disabled = false;
                    });
            }

            function showPreview() {
                previewButton.disabled = true;

                fetch('process_words.php?action=preview&lines=20')
                    .then(response => response.json())
                    .then(data => {
                        if (data.preview && data.preview.length > 0) {
                            previewContent.textContent = data.preview.join('');
                            previewContainer.style.display = 'block';
                        } else {
                            previewContent.textContent = 'No preview available yet. Process the file first.';
                            previewContainer.style.display = 'block';
                        }
                        previewButton.disabled = false;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        previewContent.textContent = 'Error loading preview.';
                        previewContainer.style.display = 'block';
                        previewButton.disabled = false;
                    });
            }

            function showWordsPreview() {
                wordsPreviewButton.disabled = true;

                fetch('process_words.php?action=words_preview&lines=30')
                    .then(response => response.json())
                    .then(data => {
                        if (data.preview && data.preview.length > 0) {
                            wordsPreviewContent.textContent = data.preview.join('');
                            wordsPreviewContainer.style.display = 'block';
                        } else {
                            wordsPreviewContent.textContent = 'No words preview available yet. Extract words first.';
                            wordsPreviewContainer.style.display = 'block';
                        }
                        wordsPreviewButton.disabled = false;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        wordsPreviewContent.textContent = 'Error loading words preview.';
                        wordsPreviewContainer.style.display = 'block';
                        wordsPreviewButton.disabled = false;
                    });
            }
        });
    </script>
</body>

</html>