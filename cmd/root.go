package cmd

import (
	"encoding/json"
	"io"
	"os"

	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	homePath    string
	debug       bool
	config      *Config
	defaultHome = os.ExpandEnv("$HOME/.resolute")
	appName     = "resolute"
)

func NewRootCmd() *cobra.Command {
	var rootCmd = &cobra.Command{
		Use:   appName,
		Short: "Resolute is an advanced spacecraft designed to travel through the space. connecting all Cosmos sovereign chains.",
	}

	rootCmd.CompletionOptions.DisableDefaultCmd = true

	rootCmd.PersistentPreRunE = func(cmd *cobra.Command, _ []string) error {
		if err := initConfig(rootCmd); err != nil {
			return err
		}
		return nil
	}

	// --home flag
	rootCmd.PersistentFlags().StringVar(&homePath, flags.FlagHome, defaultHome, "set home directory")
	if err := viper.BindPFlag(flags.FlagHome, rootCmd.PersistentFlags().Lookup(flags.FlagHome)); err != nil {
		panic(err)
	}

	// --debug flag
	rootCmd.PersistentFlags().BoolVarP(&debug, "debug", "d", false, "debug output")
	if err := viper.BindPFlag("debug", rootCmd.PersistentFlags().Lookup("debug")); err != nil {
		panic(err)
	}

	rootCmd.AddCommand(
		chainsCmd(),
		txCmd(),
		queryCmd(),
		keysCmd(),
		versionCmd(),
	)
	return rootCmd
}

func Execute() {
	rootCmd := NewRootCmd()
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

// writeJSON encodes the given object to the given writer.
func writeJSON(w io.Writer, obj interface{}) error {
	// Although simple, this is just subtle enough
	// and used in enough places to justify its own function.

	// Using an encoder is slightly preferable over json.Marshal
	// as the encoder will write directly to the io.Writer
	// instead of copying to a temporary buffer.
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	return enc.Encode(obj)
}
