<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->text('selected_text')->nullable()->change();
            $table->integer('start_position')->nullable()->change();
            $table->integer('end_position')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->text('selected_text')->nullable(false)->change();
            $table->integer('start_position')->nullable(false)->change();
            $table->integer('end_position')->nullable(false)->change();
        });
    }
};
